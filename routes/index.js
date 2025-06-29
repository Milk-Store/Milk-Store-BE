const express = require("express");
const router = express.Router();

const categoryRoute = require("./category.route");
const refreshRoute = require("./refresh.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
const productRoute = require("./product.route");
const authRoute = require("./auth.route");
const analyticsRoute = require("./analytics.route");
const sliderRoute = require("./slider.route");
const videoRoute = require("./video.route");
const bannerRoute = require("./banner.route");
const notificationRoute = require("./notification.route");
const postRoute = require("./post.route");
const chatbotRoute = require("./chatbot.route");
const { BASE_ENDPOINT } = require("../constants/endpoints");

router.use(BASE_ENDPOINT.CATEGORY, categoryRoute);
router.use(BASE_ENDPOINT.REFRESH, refreshRoute);
router.use(BASE_ENDPOINT.USER, userRoute);
router.use(BASE_ENDPOINT.ORDER, orderRoute);
router.use(BASE_ENDPOINT.PRODUCT, productRoute);
router.use(BASE_ENDPOINT.AUTH, authRoute);
router.use(BASE_ENDPOINT.ANALYTICS, analyticsRoute);
router.use(BASE_ENDPOINT.SLIDER, sliderRoute);
router.use(BASE_ENDPOINT.VIDEO, videoRoute);
router.use(BASE_ENDPOINT.BANNER, bannerRoute);
router.use(BASE_ENDPOINT.NOTIFICATION, notificationRoute);
router.use(BASE_ENDPOINT.POST, postRoute);
router.use(BASE_ENDPOINT.CHATBOT, chatbotRoute);

module.exports = router;