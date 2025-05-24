const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiUserController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validate } = require('../middleware/validator');
const { MESSAGE } = require('../constants/messages')
const { BASE_ENDPOINT } = require('../constants/endpoints')
// Route public - đăng ký tài khoản
router.post(
  BASE_ENDPOINT.REGISTER, 
  [
    body('name').notEmpty().withMessage(MESSAGE.VALIDATION.REQUIRED('Tên')),
    body('email').isEmail().withMessage(MESSAGE.VALIDATION.INVALID('Email')),
    body('password').isLength({ min: 6 }).withMessage(MESSAGE.VALIDATION.MIN_LENGTH('Mật khẩu', 6))
  ],
  validate,
  ApiUserController.create
);

// Route có xác thực
router.get(BASE_ENDPOINT.BASE, auth, isAdmin, ApiUserController.getAll);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  [
    body('name').optional().notEmpty().withMessage(MESSAGE.VALIDATION.REQUIRED('Tên')),
    body('email').optional().isEmail().withMessage(MESSAGE.VALIDATION.INVALID('Email')),
    body('password').optional().isLength({ min: 6 }).withMessage(MESSAGE.VALIDATION.MIN_LENGTH('Mật khẩu', 6))
  ],
  validate,
  ApiUserController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiUserController.remove);

module.exports = router; 