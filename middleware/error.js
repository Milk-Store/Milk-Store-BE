const { STATUS } = require('../constants/httpStatusCodes');
const { MESSAGE } = require('../constants/messages');

// Middleware xử lý lỗi 404 - Not Found
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Không tìm thấy: ${req.originalUrl}`);
  res.status(STATUS.NOT_FOUND);
  next(error);
};

// Middleware xử lý lỗi toàn cục
const errorHandler = (err, req, res, next) => {
  // Nếu đã set status code thì giữ nguyên, nếu không thì mặc định là 500
  const statusCode = res.statusCode === 200 ? STATUS.SERVER_ERROR : res.statusCode;
  
  // Log lỗi trong môi trường dev
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  
  // Trả về response lỗi
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || MESSAGE.ERROR.INTERNAL,
    success: false,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
}; 