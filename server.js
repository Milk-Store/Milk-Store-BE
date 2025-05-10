require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { STATUS } = require('./constants/httpStatusCodes');
const { notFoundHandler, errorHandler } = require('./middleware/error');
const { createAdminUser } = require('./seeders/admin-user');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 8000;

// Cấu hình CORS cho phép chia sẻ cookie giữa client và server
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiRoutes = require("./routes/index");

// Routes
app.use("/api", apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Milk Store API - Welcome' });
});

// Middleware xử lý lỗi 404 - Phải đặt sau tất cả các routes
app.use(notFoundHandler);

// Middleware xử lý lỗi toàn cục - Phải đặt cuối cùng
app.use(errorHandler);

// Kết nối database và khởi động server
const startServer = async () => {
  try {
    // Kiểm tra kết nối đến database
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Tự động tạo tài khoản admin nếu chưa có
    await createAdminUser();
    
    // Khởi động server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Khởi động server
startServer();

// Xử lý lỗi unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
