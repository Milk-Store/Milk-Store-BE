const jwt = require('jsonwebtoken');
const { STATUS } = require('../constants/httpStatusCodes');
const { MESSAGE } = require('../constants/messages');
const { AUTH } = require('../constants/auth');
const sendResponse = require('../utils/responseFormatter');

const auth = (req, res, next) => {
  // Lấy token từ cookies
  const token = req.cookies[AUTH.COOKIES.ACCESS_TOKEN];
  
  if (!token) {
    return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Xử lý token hết hạn hoặc không hợp lệ
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.TOKEN_EXPIRED);
    }
    return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED);
  }
};

module.exports = auth; 