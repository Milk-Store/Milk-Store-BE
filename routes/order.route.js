const express = require("express");
const router = express.Router();
const ApiOrderController = require("../controllers/order.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { BASE_ENDPOINT } = require('../constants/endpoints')
// Lấy danh sách order (admin xem tất cả, user chỉ xem của mình)
router.get(BASE_ENDPOINT.BASE, auth, isAdmin, ApiOrderController.getAll);

router.get(BASE_ENDPOINT.ADMIN_LIST, auth, isAdmin, ApiOrderController.getAllByAdmin)

// Tạo order (user đã đăng nhập hoặc không)
router.post(
  BASE_ENDPOINT.BASE, 
  ApiOrderController.create
);

// Cập nhật và xóa order (chỉ admin)
router.put(
  "/:id", 
  auth, 
  isAdmin, 
  ApiOrderController.update
);

router.delete("/:id", auth, isAdmin, ApiOrderController.remove);

module.exports = router; 