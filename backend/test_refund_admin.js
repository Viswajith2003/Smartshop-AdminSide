const mongoose = require('mongoose');
const AdminService = require('./Modules/admin/adminService');
const Order = require('./models/Order');
const User = require('./models/User');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/smartshop-ai');
  console.log('Connected to MongoDB.');

  const orderId = '6a1b066fd88be8a7e8044c0e';
  const orderBefore = await Order.findById(orderId);
  const userBefore = await User.findById(orderBefore.user);

  console.log('\n--- BEFORE CANCEL ---');
  console.log('Order Status:', orderBefore.orderStatus);
  console.log('Payment Status:', orderBefore.paymentStatus);
  console.log('User Wallet Balance:', userBefore.wallet.balance);
  console.log('Wallet Transactions Count:', userBefore.wallet.transactions.length);

  console.log('\nProcessing cancellation via AdminService...');
  const updatedOrder = await AdminService.updateOrderStatus(orderId, 'Cancelled');

  const orderAfter = await Order.findById(orderId);
  const userAfter = await User.findById(orderBefore.user);

  console.log('\n--- AFTER CANCEL ---');
  console.log('Order Status:', orderAfter.orderStatus);
  console.log('Payment Status:', orderAfter.paymentStatus);
  console.log('User Wallet Balance:', userAfter.wallet.balance);
  console.log('Wallet Transactions Count:', userAfter.wallet.transactions.length);
  console.log('New Transaction Log:', userAfter.wallet.transactions[userAfter.wallet.transactions.length - 1]);

  await mongoose.disconnect();
}

test().catch(err => {
  console.error('Error running test:', err);
  mongoose.disconnect();
});
