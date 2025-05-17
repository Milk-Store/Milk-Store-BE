const express = require("express");
const router = express.Router();
const ApiAnalyticsController = require("../controllers/analytics.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

// Tất cả các route analytics đều yêu cầu quyền admin
router.use(auth, isAdmin);

// Lấy tổng quan dashboard
router.get("/overview", ApiAnalyticsController.getDashboardOverview);

// Lấy thống kê đơn hàng theo thời gian
router.get("/orders/statistics", ApiAnalyticsController.getOrderStatistics);

// Lấy thống kê trạng thái đơn hàng
router.get("/orders/status", ApiAnalyticsController.getOrderStatusStatistics);

// Lấy top sản phẩm bán chạy
router.get("/products/top-selling", ApiAnalyticsController.getTopSellingProducts);

module.exports = router;
