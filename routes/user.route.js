const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiUserController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validate } = require('../middleware/validator');

// Route public - đăng ký tài khoản
router.post(
  "/register", 
  [
    body('name').notEmpty().withMessage('Tên là bắt buộc'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
  ],
  validate,
  ApiUserController.create
);

// Route có xác thực
router.get("/", auth, isAdmin, ApiUserController.getAll);

router.put(
  "/:id", 
  auth, 
  [
    body('name').optional().notEmpty().withMessage('Tên không được để trống'),
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    body('password').optional().isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
  ],
  validate,
  ApiUserController.update
);

router.delete("/:id", auth, isAdmin, ApiUserController.remove);

module.exports = router; 