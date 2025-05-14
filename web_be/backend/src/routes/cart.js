const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/', auth.protect, cartController.getCart);
router.post('/add', auth.protect, cartController.addToCart);
router.put('/update', auth.protect, cartController.updateCartItem);
router.delete('/remove', auth.protect, cartController.removeCartItem);

module.exports = router; 