const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiProductController = require("../controllers/product.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validate } = require('../middleware/validator');
const { AUTH } = require('../constants/auth');

// Route public
router.get("/", ApiProductController.getAll);

// Route với phân quyền admin
router.post(
  "/", 
  auth, 
  isAdmin, 
  [
    body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('price').isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
    body('category_id').isInt({ min: 1 }).withMessage('Danh mục không hợp lệ')
  ],
  validate,
  ApiProductController.create
);

router.put(
  "/:id", 
  auth, 
  isAdmin, 
  [
    body('name').optional().notEmpty().withMessage('Tên sản phẩm không được để trống'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
    body('category_id').optional().isInt({ min: 1 }).withMessage('Danh mục không hợp lệ')
  ],
  validate,
  ApiProductController.update
);

router.delete("/:id", auth, isAdmin, ApiProductController.remove);

module.exports = router; 