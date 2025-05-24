const express = require("express");
const router = express.Router();
const ApiRefreshController = require("../controllers/refresh.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { BASE_ENDPOINT } = require('../constants/endpoints')

// Lấy tất cả token (chỉ admin)
router.get(BASE_ENDPOINT.BASE, auth, isAdmin, ApiRefreshController.getAll);

// Lấy token của user hiện tại
router.get(BASE_ENDPOINT.USER_ONLY, auth, ApiRefreshController.getUserTokens);

// Xóa các token hết hạn (chỉ admin)
router.delete(BASE_ENDPOINT.EXPIRED, auth, isAdmin, ApiRefreshController.removeExpired);

module.exports = router; 