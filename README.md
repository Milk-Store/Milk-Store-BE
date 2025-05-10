# Milk Store Backend

Backend API cho ứng dụng Milk Store.

## Yêu cầu hệ thống

- Node.js v14+ 
- MySQL v5.7+

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/username/milk-store-be.git
cd Milk-Store-BE
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```

4. Cấu hình các thông số trong file `.env`:
```
# Ứng dụng
NODE_ENV=development
PORT=8000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=milk_store_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Client
CLIENT_URL=http://localhost:5173

# Admin mặc định
ADMIN_EMAIL= giá trị từ biến môi trường `ADMIN_EMAIL`
ADMIN_PASSWORD= giá trị từ biến môi trường `ADMIN_PASSWORD`
```

5. Tạo database trong MySQL:
```sql
CREATE DATABASE milk_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Khởi tạo database và tạo tài khoản admin mặc định:
```bash
npm run init-db
```

## Sử dụng

### Chạy ở môi trường phát triển:
```bash
npm run dev
```

### Chạy ở môi trường production:
```bash
npm start
```

## Tài khoản mặc định

- Email: giá trị từ biến môi trường `ADMIN_EMAIL`
- Mật khẩu: giá trị từ biến môi trường `ADMIN_PASSWORD`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Làm mới token

### Users
- `GET /api/users` - Lấy danh sách người dùng (admin)
- `POST /api/users/register` - Đăng ký tài khoản
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng (admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Thêm danh mục mới (admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (admin)
- `DELETE /api/categories/:id` - Xóa danh mục (admin)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng (admin)
- `DELETE /api/orders/:id` - Xóa đơn hàng (admin)

## License

ISC