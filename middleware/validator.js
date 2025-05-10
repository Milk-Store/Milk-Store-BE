const { validationResult } = require('express-validator');
const sendResponse = require('../utils/responseFormatter');
const { STATUS } = require('../constants/httpStatusCodes');

/**
 * Middleware để kiểm tra lỗi validation
 * Sử dụng sau các validator của express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      'Dữ liệu không hợp lệ',
      null,
      false,
      errors.array()
    );
  }
  next();
};

module.exports = {
  validate
}; 