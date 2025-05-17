const express = require("express");
const router = express.Router();
const ApiOrderController = require("../controllers/order.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

// Lấy danh sách order (admin xem tất cả, user chỉ xem của mình)
router.get("/", auth, isAdmin, ApiOrderController.getAll);

// Tạo order (user đã đăng nhập hoặc không)
router.post(
  "/", 
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