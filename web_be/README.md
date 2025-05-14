# Toy World - Hệ thống Quản lý Cửa hàng Đồ chơi

## Giới thiệu
Toy World là một hệ thống quản lý cửa hàng đồ chơi trực tuyến, cung cấp các tính năng đăng nhập, đăng ký và quản lý sản phẩm. Hệ thống được xây dựng với giao diện người dùng thân thiện và bảo mật cao.

## Cài đặt và Chạy ứng dụng

### Yêu cầu hệ thống
- Node.js (phiên bản 14.0.0 trở lên)
- MongoDB (phiên bản 4.0 trở lên)
- npm 

### Các bước cài đặt
1. Clone repository về máy:
```bash
git clone [đường-dẫn-repository]
cd web_be
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Tạo file .env trong thư mục gốc và cấu hình các biến môi trường:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/toyworld
JWT_SECRET=your_jwt_secret_key
```

4. Khởi động server:
```bash
npm start
```

Server sẽ chạy tại địa chỉ: http://localhost:3000

## Các chức năng đã triển khai

### 1. Xác thực người dùng
#### Đăng nhập
- **Endpoint**: POST `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response thành công**:
  ```json
  {
    "success": true,
    "token": "jwt_token_here"
  }
  ```

#### Đăng ký
- **Endpoint**: POST `/api/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789"
  }
  ```

### 2. Giao diện người dùng
#### Trang đăng nhập (`/DangNhap.html`)
- Giao diện đăng nhập với form email và mật khẩu
- Tùy chọn đăng nhập bằng Facebook và Google
- Liên kết quên mật khẩu
- Liên kết đăng ký tài khoản mới

#### Trang đăng ký (`/DangKy.html`)
- Form đăng ký với các trường thông tin cơ bản
- Validation dữ liệu đầu vào
- Thông báo lỗi/thành công

## Hướng dẫn sử dụng

### Đăng nhập
1. Truy cập trang đăng nhập tại đường dẫn `/DangNhap.html`
2. Nhập email và mật khẩu của bạn
3. Nhấn nút "Đăng nhập" hoặc sử dụng đăng nhập bằng Facebook/Google
4. Sau khi đăng nhập thành công, bạn sẽ được chuyển hướng đến trang chủ

### Đăng ký
1. Truy cập trang đăng ký tại đường dẫn `/DangKy.html`
2. Điền đầy đủ thông tin yêu cầu:
   - Email (bắt buộc)
   - Mật khẩu (tối thiểu 6 ký tự)
   - Họ và tên
   - Số điện thoại
3. Nhấn nút "Đăng ký" để tạo tài khoản mới

### Quên mật khẩu
1. Tại trang đăng nhập, nhấn vào liên kết "Quên mật khẩu?"
2. Nhập email đã đăng ký
3. Làm theo hướng dẫn trong email để đặt lại mật khẩu

## Cấu trúc thư mục
```
web_be/
├── src/
│   ├── public/          # Chứa các file HTML, CSS, client-side JS
│   ├── routes/          # Định nghĩa các routes API
│   ├── controllers/     # Xử lý logic nghiệp vụ
│   ├── models/          # Định nghĩa schema database
│   └── middleware/      # Middleware xử lý
├── .env                 # File cấu hình môi trường
├── package.json         # Quản lý dependencies
└── README.md           # Tài liệu hướng dẫn
```

## Bảo mật
- Tất cả dữ liệu được mã hóa trong quá trình truyền tải
- Mật khẩu được lưu trữ an toàn với mã hóa
- Phiên đăng nhập được bảo vệ bằng token
- Tuân thủ các tiêu chuẩn bảo mật web hiện đại

## Hỗ trợ
Nếu bạn gặp bất kỳ vấn đề nào, vui lòng liên hệ:
- Email: support@toyworld.com
- Hotline: 1900-xxxx
- Thời gian hỗ trợ: 8:00 - 22:00 (Thứ 2 - Chủ nhật)

## Giấy phép
© 2024 Toy World. Bảo lưu mọi quyền. 