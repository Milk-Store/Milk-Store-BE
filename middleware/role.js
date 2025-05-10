const { STATUS } = require('../constants/httpStatusCodes');
const { MESSAGE } = require('../constants/messages');
const { AUTH } = require('../constants/auth');
const sendResponse = require('../utils/responseFormatter');

const role = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(res, STATUS.FORBIDDEN, MESSAGE.ERROR.FORBIDDEN);
    }

    next();
  };
};

// Middleware kiểm tra vai trò admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return sendResponse(res, STATUS.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED);
  }

  if (req.user.role !== AUTH.ROLES.ADMIN) {
    return sendResponse(res, STATUS.FORBIDDEN, MESSAGE.ERROR.FORBIDDEN);
  }

  next();
};

module.exports = { 
  role,
  isAdmin
}; 