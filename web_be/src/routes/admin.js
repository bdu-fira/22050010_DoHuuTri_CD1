const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Middleware kiểm tra đăng nhập admin
function requireAdminLogin(req, res, next) {
  if (req.session && req.session.adminLoggedIn) {
    return next();
  }
  res.redirect('/admin/login');
}

// Thiết lập multer để upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/img/products'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: multer.memoryStorage() });

// Trang đăng nhập admin
router.get('/login', (req, res) => {
  res.render('admin_login', { layout: false, error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@123' && password === '12345') {
    req.session.adminLoggedIn = true;
    return res.redirect('/admin/products');
  }
  res.render('admin_login', { layout: false, error: 'Sai tài khoản hoặc mật khẩu!' });
});

// Đăng xuất admin
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Áp dụng middleware cho các route quản lý sản phẩm
router.use('/products', requireAdminLogin);

// Hiển thị danh sách sản phẩm
router.get('/products', (req, res) => {
  db.query('SELECT sanpham.*, loaisanpham.TenLSP FROM sanpham LEFT JOIN loaisanpham ON sanpham.MaLSP = loaisanpham.MaLSP', (err, results) => {
    if (err) return res.send('Lỗi truy vấn');
    results.forEach(p => {
      if (p.HinhAnh) {
        p.HinhAnhBase64 = Buffer.from(p.HinhAnh).toString('base64');
      } else {
        p.HinhAnhBase64 = null;
      }
    });
    res.render('admin_products', { products: results });
  });
});

// Form thêm sản phẩm
router.get('/products/add', (req, res) => {
  res.render('admin_product_form', { product: {}, action: 'add' });
});

// Xử lý thêm sản phẩm
router.post('/products/add', upload.single('image'), (req, res) => {
  const { TenSP, DonGia, SoLuong, TenLSP, MoTa } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  // Tìm MaLSP theo TenLSP
  db.query('SELECT MaLSP FROM loaisanpham WHERE TenLSP = ?', [TenLSP], (err, results) => {
    if (err) return res.send('Lỗi truy vấn loại sản phẩm: ' + err.message);
    function insertProduct(MaLSP) {
      db.query(
        'INSERT INTO sanpham (TenSP, DonGia, SoLuong, HinhAnh, MaLSP, MoTa, ThoiGian) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [TenSP, DonGia, SoLuong, imageBuffer, MaLSP, MoTa],
        (err) => {
          if (err) return res.send('Lỗi thêm sản phẩm: ' + err.message);
          res.redirect('/admin/products');
        }
      );
    }
    if (results.length === 0) {
      db.query('INSERT INTO loaisanpham (TenLSP) VALUES (?)', [TenLSP], (err, insertResult) => {
        if (err) return res.send('Lỗi thêm loại sản phẩm: ' + err.message);
        insertProduct(insertResult.insertId);
      });
    } else {
      insertProduct(results[0].MaLSP);
    }
  });
});

// Form sửa sản phẩm
router.get('/products/edit/:MaSP', (req, res) => {
  db.query('SELECT * FROM sanpham WHERE MaSP = ?', [req.params.MaSP], (err, results) => {
    if (err || results.length === 0) return res.send('Không tìm thấy sản phẩm');
    res.render('admin_product_form', { product: results[0], action: 'edit' });
  });
});

// Xử lý sửa sản phẩm
router.post('/products/edit/:MaSP', upload.single('image'), (req, res) => {
  const { TenSP, DonGia, SoLuong, TenLSP, MoTa } = req.body;

  // Tìm hoặc thêm mới loại sản phẩm
  db.query('SELECT MaLSP FROM loaisanpham WHERE TenLSP = ?', [TenLSP], (err, results) => {
    if (err) return res.send('Lỗi truy vấn loại sản phẩm: ' + err.message);

    function updateProduct(MaLSP) {
      let sql = 'UPDATE sanpham SET TenSP=?, DonGia=?, SoLuong=?, MaLSP=?, MoTa=?';
      const params = [TenSP, DonGia, SoLuong, MaLSP, MoTa];
      if (req.file) {
        sql += ', HinhAnh=?';
        params.push(req.file.buffer);
      }
      sql += ' WHERE MaSP=?';
      params.push(req.params.MaSP);
      db.query(sql, params, (err) => {
        if (err) return res.send('Lỗi cập nhật sản phẩm');
        res.redirect('/admin/products');
      });
    }

    if (results.length === 0) {
      // Nếu chưa có loại sản phẩm, tự động thêm mới
      db.query('INSERT INTO loaisanpham (TenLSP) VALUES (?)', [TenLSP], (err, insertResult) => {
        if (err) return res.send('Lỗi thêm loại sản phẩm: ' + err.message);
        updateProduct(insertResult.insertId);
      });
    } else {
      updateProduct(results[0].MaLSP);
    }
  });
});

// Xử lý xóa sản phẩm
router.post('/products/delete/:MaSP', (req, res) => {
  db.query('DELETE FROM sanpham WHERE MaSP = ?', [req.params.MaSP], (err) => {
    if (err) return res.send('Lỗi xóa sản phẩm');
    res.redirect('/admin/products');
  });
});

// Dashboard admin
router.get('/', (req, res) => {
  res.render('admin_dashboard', { layout: 'layouts/admin_layout' });
});

module.exports = router; 