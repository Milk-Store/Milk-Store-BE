const categoryEndpoints = require("./category");
const productEndpoints = require("./product");
const userEndpoints = require("./user");
const authEndpoints = require("./auth");
const orderEndpoints = require("./order");
const refreshEndpoints = require("./refresh");

module.exports = {
  CATEGORY: categoryEndpoints,
  PRODUCT: productEndpoints,
  USER: userEndpoints,
  AUTH: authEndpoints,
  ORDER: orderEndpoints,
  REFRESH: refreshEndpoints,
};
