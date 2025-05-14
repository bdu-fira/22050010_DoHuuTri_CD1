const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const { engine } = require('express-handlebars');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
  secret: 'toyworld_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
    sumQuantity: (products) => {
      if (!products) return 0;
      return products.reduce((acc, p) => acc + (p.quantity || 0), 0);
    },
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Trang chủ: lấy danh sách sản phẩm từ database
app.get('/', (req, res) => {
  db.query('SELECT * FROM sanpham', (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Lỗi truy vấn MySQL');
    }
    res.render('home', { products: results });
  });
});

app.get('/admin', (req, res) => {
  res.render('home');
});
app.get('/ChiTietSanPham', (req, res) => {
  res.render('home');
});
app.get('/DangNhap', (req, res) => {
  res.render('home');
});
app.get('/GioHang', (req, res) => {
  res.render('home');
});
app.get('/GioiThieu', (req, res) => {
  res.render('home');
});
app.get('/ThanhToan', (req, res) => {
  res.render('home');
});
app.get('/User', (req, res) => {
  res.render('home');
});

app.get('/api/sanpham', (req, res) => {
  db.query('SELECT * FROM sanpham', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
    }
    res.json(results);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Lỗi server',
    error: err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
