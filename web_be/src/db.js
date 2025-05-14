const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',        // hoặc IP database server
  user: 'root',             // username MySQL của em
  password: '',             // mật khẩu (nếu có)
  database: 'shopdochoi',   // đổi tên này thành tên thật
  port: 3306               // Đảm bảo rằng cổng này đúng nếu bạn không sử dụng cổng mặc định (3306)
});

connection.connect((err) => {
  if (err) {
    console.error('Kết nối MySQL thất bại: ' + err.stack);
    return;
  }
  console.log('Đã kết nối MySQL với id: ' + connection.threadId);
});

module.exports = connection;
