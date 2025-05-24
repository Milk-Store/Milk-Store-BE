const express = require("express");
const router = express.Router();

const categoryRoute = require("./category.route");
const refreshRoute = require("./refresh.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
const productRoute = require("./product.route");
const authRoute = require("./auth.route");
const analyticsRoute = require("./analytics.route");
const { BASE_ENDPOINT } = require("../constants/endpoints");

router.use(BASE_ENDPOINT.CATEGORY, categoryRoute);
router.use(BASE_ENDPOINT.REFRESH, refreshRoute);
router.use(BASE_ENDPOINT.USER, userRoute);
router.use(BASE_ENDPOINT.ORDER, orderRoute);
router.use(BASE_ENDPOINT.PRODUCT, productRoute);
router.use(BASE_ENDPOINT.AUTH, authRoute);
router.use(BASE_ENDPOINT.ANALYTICS, analyticsRoute);

module.exports = router;