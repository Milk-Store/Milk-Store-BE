const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiOrderController = require("../controllers/order.controller");
const auth = require("../middleware/auth");
const { role } = require("../middleware/role");
const { validate } = require('../middleware/validator');
const { AUTH } = require('../constants/auth');

// Lấy danh sách order (admin xem tất cả, user chỉ xem của mình)
router.get("/", auth, ApiOrderController.getAll);

// Tạo order (user đã đăng nhập hoặc không)
router.post(
  "/", 
  [
    body('orderData').notEmpty().withMessage('Dữ liệu đơn hàng là bắt buộc'),
    body('orderItems').isArray({ min: 1 }).withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
    body('orderItems.*.product_id').isInt({ min: 1 }).withMessage('ID sản phẩm không hợp lệ'),
    body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Số lượng phải ít nhất là 1')
  ],
  validate,
  ApiOrderController.create
);

// Cập nhật và xóa order (chỉ admin)
router.put(
  "/:id", 
  auth, 
  role([AUTH.ROLES.ADMIN]), 
  [
    body('status').optional().isIn(['pending', 'processing', 'completed', 'cancelled'])
      .withMessage('Trạng thái không hợp lệ')
  ],
  validate,
  ApiOrderController.update
);

router.delete("/:id", auth, role([AUTH.ROLES.ADMIN]), ApiOrderController.remove);

module.exports = router; 