-- Tạo CSDL
CREATE DATABASE shopdochoi;
USE shopdochoi;

-- Bảng DanhMuc: Lưu trữ các danh mục chính của cửa hàng
-- AUTO_INCREMENT: Tự động tăng ID khi thêm mới
CREATE TABLE DanhMuc (
    MaDanhMuc INT PRIMARY KEY AUTO_INCREMENT,
    TenDanhMuc VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);

-- Bảng LoaiSanPham: Lưu trữ các loại sản phẩm thuộc danh mục
-- COLLATE utf8mb4_unicode_ci: Hỗ trợ đầy đủ tiếng Việt
-- ON DELETE SET NULL: Khi xóa danh mục, loại sản phẩm vẫn giữ nguyên nhưng MaDM = NULL
CREATE TABLE LoaiSanPham (
    MaLSP INT PRIMARY KEY AUTO_INCREMENT,
    TenLSP VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    HinhAnh VARCHAR(255),
    MoTa VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    MaDM INT,
    FOREIGN KEY (MaDM) REFERENCES DanhMuc(MaDanhMuc)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Bảng SanPham: Lưu trữ thông tin chi tiết sản phẩm
-- CHECK (SoLuong >= 0): Đảm bảo số lượng không âm
-- CHECK (SoSao BETWEEN 1 AND 5): Đánh giá sao từ 1-5
-- DEFAULT CURRENT_TIMESTAMP: Tự động cập nhật thời gian khi thêm mới
CREATE TABLE SanPham (
    MaSP INT PRIMARY KEY AUTO_INCREMENT,
    MaLSP INT,
    TenSP VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    DonGia DECIMAL(10,2) NOT NULL,
    SoLuong INT NOT NULL DEFAULT 0 CHECK (SoLuong >= 0),
    HinhAnh LONGBLOB,
    KichThuoc TEXT,
    ChatLieu VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    MauSac VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    DoviTinh VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    NoiSanXuat VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    SoSao INT DEFAULT 5 CHECK (SoSao BETWEEN 1 AND 5),
    TrangThai VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Còn hàng',
    MoTa TEXT,
    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaLSP) REFERENCES LoaiSanPham(MaLSP)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Bảng PhanQuyen: Quản lý phân quyền người dùng
-- ChiTietQuyen: Mô tả chi tiết quyền của từng vai trò
CREATE TABLE PhanQuyen (
    MaPQ INT PRIMARY KEY AUTO_INCREMENT,
    TenQuyen VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    ChiTietQuyen VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
);

-- Bảng NguoiDung: Lưu thông tin người dùng
-- UNIQUE: Đảm bảo email và tài khoản không trùng lặp
-- CHECK (GioiTinh IN ('Nam', 'Nữ')): Giới hạn giá trị giới tính
CREATE TABLE NguoiDung (
    MaND INT PRIMARY KEY AUTO_INCREMENT,
    Ho VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Ten VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    GioiTinh VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci CHECK (GioiTinh IN ('Nam', 'Nữ')),
    SDT VARCHAR(15),
    Email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE,
    DiaChi VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    TaiKhoan VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    MatKhau VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    MaPQ INT,
    TrangThai VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Hoạt động',
    FOREIGN KEY (MaPQ) REFERENCES PhanQuyen(MaPQ)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Bảng HoaDon: Lưu thông tin đơn hàng
-- DEFAULT CURRENT_TIMESTAMP: Tự động cập nhật thời gian tạo đơn
-- CHECK (TongTien >= 0): Đảm bảo tổng tiền không âm
CREATE TABLE HoaDon (
    MaHD INT PRIMARY KEY AUTO_INCREMENT,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    NguoiDung INT,
    SDT VARCHAR(20),
    DiaChi VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    PhuongThucTT VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    TongTien DECIMAL(10,2) DEFAULT 0 CHECK (TongTien >= 0),
    TrangThai VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Chờ xử lý',
    FOREIGN KEY (NguoiDung) REFERENCES NguoiDung(MaND)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Bảng ChiTiet_HoaDon: Lưu chi tiết từng sản phẩm trong đơn hàng
-- ON DELETE CASCADE: Khi xóa hóa đơn, chi tiết hóa đơn cũng bị xóa
-- CHECK (SoLuong > 0): Đảm bảo số lượng mua > 0
CREATE TABLE ChiTiet_HoaDon (
    OrderdetailID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT,
    MaHD INT,
    SoLuong INT CHECK (SoLuong > 0),
    DonGia DECIMAL(10,2) CHECK (DonGia >= 0),
    FOREIGN KEY (ProductID) REFERENCES SanPham(MaSP)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (MaHD) REFERENCES HoaDon(MaHD)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Bảng KhuyenMai: Quản lý chương trình khuyến mãi
-- CONSTRAINT chk_ngay: Đảm bảo ngày kết thúc > ngày bắt đầu
-- CONSTRAINT chk_trang_thai: Giới hạn các trạng thái khuyến mãi
CREATE TABLE KhuyenMai (
    MaKM VARCHAR(50) PRIMARY KEY,
    TenKM VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    LoaiKM VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    GiaTriKM FLOAT CHECK (GiaTriKM >= 0),
    NgayBD DATETIME,
    TrangThai VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Đang áp dụng',
    NgayKT DATETIME,
    CONSTRAINT chk_ngay CHECK (NgayKT > NgayBD),
    CONSTRAINT chk_trang_thai CHECK (TrangThai IN ('Đang áp dụng', 'Hết hạn', 'Tạm ngưng'))
);

-- Ràng buộc cho số điện thoại: Chỉ cho phép 10-11 số
ALTER TABLE NguoiDung ADD CONSTRAINT chk_sdt CHECK (SDT REGEXP '^[0-9]{10,11}$');

-- Ràng buộc cho email: Đảm bảo định dạng email hợp lệ
ALTER TABLE NguoiDung ADD CONSTRAINT chk_email CHECK (Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Thêm dữ liệu mẫu cho các bảng
-- Lưu ý: Không cần chỉ định ID khi đã có AUTO_INCREMENT
INSERT INTO DanhMuc (TenDanhMuc) 
VALUES
('Đồ chơi trẻ em'),
('Đồ chơi thể thao'),
('Đồ chơi trí tuệ'),
('Đồ chơi công nghệ');

-- Thêm dữ liệu vào bảng LoaiSanPham
INSERT INTO LoaiSanPham (MaLSP, TenLSP, HinhAnh, MoTa, MaDM)
VALUES
(1, 'Búp bê', 'bupbe.jpg', 'Đồ chơi búp bê cho trẻ em', 1),
(2, 'Lego', 'lego.jpg', 'Bộ đồ chơi lắp ghép Lego', 1),
(3, 'Bóng đá', 'bongda.jpg', 'Bóng đá cho các bạn yêu thể thao', 2),
(4, 'Bàn cờ', 'banco.jpg', 'Bàn cờ vua thông minh', 3),
(5, 'Drone', 'drone.jpg', 'Máy bay điều khiển từ xa', 4);

-- Thêm dữ liệu vào bảng SanPham
INSERT INTO SanPham (MaSP, MaLSP, TenSP, DonGia, SoLuong, HinhAnh, KichThuoc, ChatLieu, MauSac, DoviTinh, NoiSanXuat, SoSao, TrangThai, MoTa, ThoiGian)
VALUES
(1, 1, 'Búp bê Barbie', 250000, 50, NULL, '30cm', 'Nhựa', 'Hồng', 'cm', 'Việt Nam', 5, 'Còn hàng', 'Búp bê Barbie với nhiều phụ kiện đi kèm', NOW()),
(2, 2, 'Bộ Lego Thành Phố', 350000, 30, NULL, '30x30x30cm', 'Nhựa', 'Đỏ', 'cm', 'Trung Quốc', 4, 'Còn hàng', 'Bộ Lego với các chi tiết xây dựng thành phố', NOW()),
(3, 3, 'Bóng đá Adidas', 300000, 100, NULL, '23cm', 'Da', 'Xanh', 'cm', 'Hàn Quốc', 4, 'Còn hàng', 'Bóng đá chính hãng Adidas', NOW()),
(4, 4, 'Bàn cờ vua gỗ', 500000, 20, NULL, '50x50cm', 'Gỗ', 'Nâu', 'cm', 'Việt Nam', 5, 'Còn hàng', 'Bàn cờ vua chất liệu gỗ cao cấp', NOW()),
(5, 5, 'Drone điều khiển từ xa', 1000000, 15, NULL, '20x20cm', 'Nhựa', 'Đen', 'cm', 'Mỹ', 4, 'Còn hàng', 'Drone điều khiển từ xa, bay ổn định', NOW());

-- Thêm dữ liệu vào bảng PhanQuyen
INSERT INTO PhanQuyen (MaPQ, TenQuyen, ChiTietQuyen) 
VALUES
(1, 'Admin', 'Quản lý toàn bộ hệ thống'),
(2, 'Quản lý', 'Quản lý các sản phẩm và đơn hàng'),
(3, 'Nhân viên', 'Xử lý đơn hàng và chăm sóc khách hàng'),
(4, 'Khách hàng', 'Mua sắm và theo dõi đơn hàng');

-- Thêm dữ liệu vào bảng NguoiDung
INSERT INTO NguoiDung (MaND, Ho, Ten, GioiTinh, SDT, Email, DiaChi, TaiKhoan, MatKhau, MaPQ, TrangThai) 
VALUES
(1, 'Nguyễn', 'Anh Tuấn', 'Nam', '0912345678', 'tuan@gmail.com', 'Bình Dương', 'tuan123', 'password1', 1, 'Hoạt động'),
(2, 'Lê', 'Thu Hương', 'Nữ', '0987654321', 'huong@gmail.com', 'Hồ Chí Minh', 'huong456', 'password2', 2, 'Hoạt động'),
(3, 'Trần', 'Bảo Nam', 'Nam', '0901234567', 'nam@gmail.com', 'Đà Nẵng', 'nam789', 'password3', 3, 'Hoạt động'),
(4, 'Phạm', 'Hồng Quý', 'Nam', '0923456789', 'quy@gmail.com', 'Bình Dương', 'quy123', 'password4', 4, 'Hoạt động');

-- Thêm dữ liệu vào bảng HoaDon
INSERT INTO HoaDon (MaHD, NgayLap, NguoiDung, SDT, DiaChi, PhuongThucTT, TongTien, TrangThai)
VALUES
(1, NOW(), 1, '0912345678', 'Bình Dương', 'Thanh toán khi nhận hàng', 500000, 'Chờ xử lý'),
(2, NOW(), 2, '0987654321', 'Hồ Chí Minh', 'Thẻ tín dụng', 350000, 'Chờ xử lý'),
(3, NOW(), 3, '0901234567', 'Đà Nẵng', 'Chuyển khoản', 1000000, 'Chờ xử lý');

-- Thêm dữ liệu vào bảng ChiTiet_HoaDon
INSERT INTO ChiTiet_HoaDon (OrderdetailID, ProductID, MaHD, SoLuong, DonGia)
VALUES
(1, 1, 1, 2, 250000),
(2, 2, 1, 1, 350000),
(3, 3, 2, 3, 300000),
(4, 4, 3, 1, 500000);

-- Thêm các giá trị mặc định hợp lý
ALTER TABLE SanPham MODIFY SoSao INT DEFAULT 5;
ALTER TABLE HoaDon ALTER COLUMN TrangThai SET DEFAULT 'Chờ xử lý';
ALTER TABLE NguoiDung ALTER COLUMN TrangThai SET DEFAULT 'Hoạt động';

-- Thêm index để tối ưu hiệu suất truy vấn
-- idx_ten_sp: Tìm kiếm sản phẩm theo tên
-- idx_email: Tìm kiếm người dùng theo email
-- idx_ngay_lap: Tìm kiếm hóa đơn theo ngày
ALTER TABLE SanPham ADD INDEX idx_ten_sp (TenSP);
ALTER TABLE NguoiDung ADD INDEX idx_email (Email);
ALTER TABLE HoaDon ADD INDEX idx_ngay_lap (NgayLap);
