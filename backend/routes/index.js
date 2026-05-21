const express = require('express');
const router = express.Router();
const authRoutes = require('../Modules/auth/authRoutes');
const userRoutes = require('../Modules/user/userRoutes');
const adminRoutes = require('../Modules/admin/adminRoutes');
const categoryRoutes = require('../Modules/category/categoryRoutes');
const productRoutes = require('../Modules/product/productRoutes');
const couponRoutes = require('../Modules/coupon/couponRoutes');
const orderRoutes = require('../Modules/order/orderRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
