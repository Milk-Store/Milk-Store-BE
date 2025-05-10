const express = require("express");
const router = express.Router();

const categoryRoute = require("./category.route");
const refreshRoute = require("./refresh.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
const productRoute = require("./product.route");
const authRoute = require("./auth.route");

router.use("/categories", categoryRoute);
router.use("/refresh", refreshRoute);
router.use("/users", userRoute);
router.use("/orders", orderRoute);
router.use("/products", productRoute);
router.use("/auth", authRoute);

module.exports = router;