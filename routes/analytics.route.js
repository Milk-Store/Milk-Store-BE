const express = require("express");
const router = express.Router();
const ApiAnalyticsController = require("../controllers/analytics.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { ANALYTICS } = require('../constants/endpoints')
// Tất cả các route analytics đều yêu cầu quyền admin
router.use(auth, isAdmin);

// Lấy tổng quan dashboard
router.get(ANALYTICS.OVERVIEW, ApiAnalyticsController.getDashboardOverview);

// Lấy thống kê đơn hàng theo thời gian
router.get(ANALYTICS.ORDER_STATISTIC, ApiAnalyticsController.getOrderStatistics);

// Lấy thống kê trạng thái đơn hàng
router.get(ANALYTICS.ORDER_STATUS, ApiAnalyticsController.getOrderStatusStatistics);

// Lấy top sản phẩm bán chạy
router.get(ANALYTICS.PRODUCT_TOP_SELLING, ApiAnalyticsController.getTopSellingProducts);

module.exports = router;
