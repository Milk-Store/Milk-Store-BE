const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiAuthController = require("../controllers/auth.controller");
const { validate } = require('../middleware/validator');
const { MESSAGE } = require('../constants/messages')
const { AUTH } = require('../constants/endpoints')
// Đăng nhập - thêm validation
router.post(
  AUTH.LOGIN, 
  [
    body('email').isEmail().withMessage(MESSAGE.VALIDATION.INVALID('Email')),
    body('password').notEmpty().withMessage(MESSAGE.VALIDATION.REQUIRED('Mật khẩu'))
  ],
  validate,
  ApiAuthController.login
);

// Đăng xuất
router.post(AUTH.LOGOUT, ApiAuthController.logout);

// Làm mới token
router.post(
  AUTH.REFRESH,
  [
    body('refreshToken').optional()
  ],
  ApiAuthController.refresh
);

module.exports = router; 