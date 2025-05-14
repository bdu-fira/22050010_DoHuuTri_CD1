const { Cart, CartItem, Product, User } = require('../models');

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ where: { userId }, include: { model: CartItem, include: Product } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId });
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      item = await CartItem.create({ cartId: cart.id, productId, quantity, price: product.price });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
    const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ' });
    item.quantity = quantity;
    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
    const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ' });
    await item.destroy();
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
}; 