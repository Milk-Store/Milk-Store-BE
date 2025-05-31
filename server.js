require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { STATUS } = require('./constants/httpStatusCodes');
const { notFoundHandler, errorHandler } = require('./middleware/error');
const { createAdminUser } = require('./seeders/admin-user');
const db = require('./models');
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Cho phép không có origin (Postman, app build)
      if (!origin) {
        return callback(null, true);
      }

      // Cho phép nếu origin nằm trong danh sách allowed
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Cho phép các origin từ mạng LAN (VD: 192.168.x.x)
      const isLAN = /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin);
      if (isLAN) {
        return callback(null, true);
      }

      console.warn('Blocked by Socket.IO CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Lưu trữ các admin socket connections
const adminSockets = new Map();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Xử lý khi admin connect và authenticate
  socket.on('admin_connect', async (token) => {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kiểm tra role admin
      if (decoded.role !== 'ROLE_ADMIN') {
        socket.disconnect();
        return;
      }

      // Lưu socket connection với thông tin admin
      adminSockets.set(socket.id, {
        socket,
        userId: decoded.id,
        role: decoded.role
      });
      
      console.log('Admin connected:', socket.id);
    } catch (error) {
      console.error('Invalid admin token:', error);
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    adminSockets.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

// Export io instance để sử dụng ở các module khác
app.set('io', io);
app.set('adminSockets', adminSockets);

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

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
    // Cho phép không có origin (Postman, app build)
    if (!origin) {
      return callback(null, true);
    }

    // Cho phép nếu origin nằm trong danh sách allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Cho phép các origin từ mạng LAN (VD: 192.168.x.x)
    const isLAN = /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin);
    if (isLAN) {
      return callback(null, true);
    }

    // Chặn còn lại
    console.warn('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS: ' + origin));
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
    server.listen(PORT, HOST, () => {
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
