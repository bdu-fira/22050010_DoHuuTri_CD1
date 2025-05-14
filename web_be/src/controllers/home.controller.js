const Product = require('../models/product.model');

class HomeController {
  async getHomePage(req, res) {
    try {
      // Truy vấn danh sách sản phẩm từ cơ sở dữ liệu
      // Giới hạn chỉ lấy 8 sản phẩm mới nhất
      const products = await Product.findAll({
        attributes: ['id', 'name', 'description', 'price', 'image', 'slug'],
        order: [['createdAt', 'DESC']],
        limit: 8
      });

      // Định dạng lại giá tiền để hiển thị đẹp hơn
      const formattedProducts = products.map(product => {
        const item = product.toJSON();
        // Định dạng giá tiền với dấu chấm phân cách hàng nghìn
        item.formattedPrice = new Intl.NumberFormat('vi-VN').format(item.price);
        return item;
      });

      // Render trang chủ với dữ liệu sản phẩm
      res.render('home', {
        products: formattedProducts,
        title: 'Trang Chủ - Shop Đồ Chơi'
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu trang chủ:', error);
      res.status(500).render('error', {
        message: 'Đã xảy ra lỗi khi tải trang. Vui lòng thử lại sau.'
      });
    }
  }
}

module.exports = new HomeController();