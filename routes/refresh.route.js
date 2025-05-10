const express = require("express");
const router = express.Router();
const ApiRefreshController = require("../controllers/refresh.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

// Lấy tất cả token (chỉ admin)
router.get("/", auth, isAdmin, ApiRefreshController.getAll);

// Lấy token của user hiện tại
router.get("/user", auth, ApiRefreshController.getUserTokens);

// Xóa các token hết hạn (chỉ admin)
router.delete("/expired", auth, isAdmin, ApiRefreshController.removeExpired);

module.exports = router; 