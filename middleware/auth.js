const jwt = require('jsonwebtoken');
const { STATUS } = require('../constants/httpStatusCodes');
const { MESSAGE } = require('../constants/messages');
const { AUTH } = require('../constants/auth');
const sendResponse = require('../utils/responseFormatter');

const auth = (req, res, next) => {
  console.log('Auth middleware running');
  // Lấy token từ cookies hoặc từ Authorization header
  let token = req.cookies[AUTH.COOKIES.ACCESS_TOKEN];
  console.log('Cookie token:', token ? 'exists' : 'not found');

  // Nếu không có token trong cookies, kiểm tra Authorization header
  if (!token && req.headers.authorization) {
    console.log('Authorization header:', req.headers.authorization);
    // Format: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Bearer token extracted');
    }
  }
  
  if (!token) {
    console.log('No token found in request');
    return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED);
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.name);
    // Xử lý token hết hạn hoặc không hợp lệ
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.TOKEN_EXPIRED);
    }
    return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED);
  }
};

module.exports = auth; 