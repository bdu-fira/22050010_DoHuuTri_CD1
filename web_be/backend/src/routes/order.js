const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth.protect, orderController.createOrder);
router.get('/', auth.protect, orderController.getOrders);

module.exports = router; 