const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sử dụng thông tin kết nối từ biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME || 'shopdochoi',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // hoặc 'postgres', 'sqlite', 'mssql'
    logging: false, // tắt logging SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
  }
}

testConnection();

module.exports = sequelize;