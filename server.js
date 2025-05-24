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
const HOST = process.env.HOST || '0.0.0.0'; // Lắng nghe tất cả các interfaces

// Cấu hình CORS cho phép chia sẻ cookie giữa client và server
const allowedOrigins = [
  process.env.URL_CLIENT_BASE,         // Web local
  process.env.URL_CLIENT_BASE_PROD,      // Web production
  process.env.URL_EXPO_DEV,     // Expo dev
  process.env.URL_EXPO_GO, 
  "http://192.168.1.148:8081",
  "http://192.168.1.235:8081",    
    // Expo Go
  // Không cần thêm gì cho app đã build – vì nó không gửi origin
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép cả không có origin (app mobile, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS: ', origin);
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-type'],
};

// GỌP tất cả vào 1 middleware CORS
app.use(cors(corsOptions));

// XỬ LÝ preflight requests CORS cho tất cả các routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const apiRoutes = require("./routes/index");

// Routes
app.use("/api", apiRoutes);

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
    app.listen(PORT, HOST, () => {
      console.log(`Server is running at http://${HOST}:${PORT}`);
      console.log(`Server is also available on your local network at:`);
      console.log(`To access it from other devices, use one of these addresses:`);
      // Hiển thị các địa chỉ IP của máy chủ
      const { networkInterfaces } = require('os');
      const nets = networkInterfaces();
      const results = {};
      
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          // Skip over internal (non-public) and non-IPv4 addresses
          if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
            console.log(`- http://${net.address}:${PORT}/api`);
          }
        }
      }
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
