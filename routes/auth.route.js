const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiAuthController = require("../controllers/auth.controller");
const { validate } = require('../middleware/validator');

// Đăng nhập - thêm validation
router.post(
  "/login", 
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc')
  ],
  validate,
  ApiAuthController.login
);

// Đăng xuất
router.post("/logout", ApiAuthController.logout);

// Làm mới token
router.post(
  "/refresh",
  [
    body('refreshToken').optional()
  ],
  ApiAuthController.refresh
);

module.exports = router; 