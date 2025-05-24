const authEndpoints = require("./auth");
const baseEndpoints = require("./base");
const analyticEndpoints = require('./analytic')

module.exports = {
  AUTH: authEndpoints,
  BASE_ENDPOINT: baseEndpoints,
  ANALYTICS: analyticEndpoints
};
