const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Order = require("../../models/Order");
const Payment = require("../../models/Payment");
const { generateAdminToken } = require("../../utils/jwt");
const { AuthenticationError, NotFoundError } = require("../../utils/errors");

class AdminService {
  static async login(credentials) {
    const { email, password } = credentials;

    const admin = await Admin.findOne({ email });
    if (!admin) throw new AuthenticationError("Invalid login credentials for admin");

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) throw new AuthenticationError("Invalid login credentials for admin");

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateAdminToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    return {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    };
  }

  static async getDashboardStats() {
    const [totalUsers, totalProducts, totalCategories, totalOrders] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments()
    ]);

    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $nin: ["Cancelled", "Returned"] } } },
      { $group: { _id: null, total: { $sum: "$pricing.totalPrice" } } }
    ]);

    const refundData = await Order.aggregate([
      { $match: { paymentStatus: "Refunded" } },
      { $group: { _id: null, total: { $sum: "$pricing.totalPrice" } } }
    ]);

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalSales: revenueData[0]?.total || 0,
      totalRefunds: refundData[0]?.total || 0
    };
  }

  static async getAllUsers(queryParams = {}) {
    const { page = 1, limit = 10, search = "" } = queryParams;
    const skip = (page - 1) * limit;

    const mongoQuery = { role: "user" };
    if (search) {
      mongoQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(mongoQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(mongoQuery);

    return {
      users,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalUsers: total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async getAllOrders(queryParams = {}) {
    const { page = 1, limit = 10, search = "", status = "" } = queryParams;
    const skip = (page - 1) * limit;

    const mongoQuery = {};
    if (search) {
      // Order ID search or user search (though user search would need aggregation or separate query)
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        mongoQuery._id = search;
      }
    }
    if (status && status !== 'All') {
      mongoQuery.orderStatus = status;
    }

    const orders = await Order.find(mongoQuery)
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(mongoQuery);

    return {
      orders,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalOrders: total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");

    const wasInactive = order.orderStatus === "Cancelled" || order.orderStatus === "Returned";
    const isNowInactive = status === "Cancelled" || status === "Returned";

    order.orderStatus = status;
    if (status === "Delivered") {
      await this._handleDeliveredOrder(order);
    } else if (isNowInactive && !wasInactive) {
      const OrderService = require("../order/orderService");
      await OrderService._updateStock(order.items, 1);
      
      // Calculate the sum of active items that have NOT been cancelled/refunded yet
      let refundAmount = 0;
      if (order.paymentStatus === "Completed") {
        const totalSubtotal = order.pricing.subtotal || 0;
        order.items.forEach(item => {
          if (item.itemStatus === "Active") {
            const itemTotal = item.price * item.quantity;
            const itemRefund = totalSubtotal > 0
              ? itemTotal - (order.pricing.discount * (itemTotal / totalSubtotal))
              : itemTotal;
            refundAmount += itemRefund;
          }
        });
      }

      // Update itemStatus to match order status
      order.items.forEach(item => {
        item.itemStatus = status;
      });

      // Credit wallet if order was paid (Completed) and there is a refund due
      if (order.paymentStatus === "Completed" && refundAmount > 0) {
        await User.findByIdAndUpdate(order.user, {
          $inc: { "wallet.balance": refundAmount },
          $push: {
            "wallet.transactions": {
              amount: refundAmount,
              type: "credit",
              status: "success",
              description: `Refund for cancelled/returned order items ${orderId}`,
              orderId,
              createdAt: new Date()
            }
          }
        });
        order.paymentStatus = "Refunded";
        await Payment.findOneAndUpdate({ order: orderId }, { status: "Refunded" });
      }
    }

    await order.save();
    return order;
  }

  static async getSalesReport(filters = {}) {
    const { startDate, endDate, status, page = 1, limit = 10 } = filters;
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) dateQuery.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateQuery.createdAt.$lte = end;
      }
    }

    const matchQuery = { 
      paymentStatus: "Completed",
      ...dateQuery
    };

    if (status && status !== 'All') {
      matchQuery.orderStatus = status;
    }

    const orders = await Order.find(matchQuery)
      .populate("user", "name")
      .populate("items.product", "name category")
      .sort({ createdAt: -1 });

    const reportData = [];
    let totalRevenue = 0;
    const uniqueProducts = new Set();

    orders.forEach(order => {
      totalRevenue += order.pricing.totalPrice;
      order.items.forEach(item => {
        if (item.product) {
          uniqueProducts.add(item.product._id.toString());
        }
        reportData.push({
          orderId: order._id,
          date: order.createdAt,
          customerName: order.user ? order.user.name : "Guest",
          productName: item.product ? item.product.name : "Unknown Product",
          quantity: item.quantity,
          price: item.price,
          status: order.orderStatus,
          couponDiscount: order.pricing.discount || 0
        });
      });
    });

    const totalItems = reportData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = reportData.slice((page - 1) * limit, page * limit);

    return {
      reportData: paginatedData,
      allReportData: reportData,
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: uniqueProducts.size
      },
      meta: {
        totalItems,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    };
  }

  // Private helper (Rule 1)
  static async _handleDeliveredOrder(order) {
    order.deliveredAt = Date.now();
    await order.populate("payment");
    if (order.payment && order.payment.method === "COD") {
      order.paymentStatus = "Completed";
      order.paidAt = Date.now();
      
      order.payment.status = "Completed";
      order.payment.paidAt = Date.now();
      await order.payment.save();
    }
  }
}

module.exports = AdminService;
