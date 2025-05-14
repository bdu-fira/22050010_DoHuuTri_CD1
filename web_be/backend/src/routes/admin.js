const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const productController = require('../controllers/productController');

// API tổng quan dashboard
router.get('/summary', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);
  
      const ordersToday = await Order.count({ where: { createdAt: { [Op.gte]: today } } });
      const revenueToday = await Order.sum('total', { where: { createdAt: { [Op.gte]: today } } }) || 0;
      const productsCount = await Product.count();
      const newCustomers = await User.count({ where: { createdAt: { [Op.gte]: today } } });
  
      res.json({ ordersToday, revenueToday, productsCount, newCustomers });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });
  
  // API đơn hàng gần đây
  router.get('/recent-orders', async (req, res) => {
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{ model: User, attributes: ['fullName'] }]
      });
      res.json(orders.map(o => ({
        code: o.id,
        customer: o.User ? o.User.fullName : 'Không rõ',
        date: o.createdAt.toLocaleDateString('vi-VN'),
        total: o.total,
        status: o.status
      })));
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });

// Thêm sản phẩm mới
router.post('/', productController.createProduct);

module.exports = router;