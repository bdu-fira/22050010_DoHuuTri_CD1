const { Order, OrderItem, Cart, CartItem, Product } = require('../models');

// Tạo đơn hàng từ giỏ hàng
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, phone } = req.body;
    const cart = await Cart.findOne({ where: { userId }, include: { model: CartItem, include: Product } });
    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }
    let total = 0;
    cart.CartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    const order = await Order.create({ userId, total, address, phone, status: 'pending' });
    for (const item of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });
    }
    // Xóa giỏ hàng sau khi đặt đơn
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Lấy lịch sử đơn hàng của user
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: { model: OrderItem, include: Product },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
}; 