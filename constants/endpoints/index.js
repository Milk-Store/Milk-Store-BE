const authEndpoints = require("./auth");
const baseEndpoints = require("./base");
const analyticEndpoints = require('./analytic')
const postEndpoints = require("./post")
const chatbotEndpoints = require("./chatbot")

module.exports = {
  AUTH: authEndpoints,
  BASE_ENDPOINT: baseEndpoints,
  ANALYTICS: analyticEndpoints,
  POST_ENDPOINT: postEndpoints,
  CHATBOT_ENDPOINT: chatbotEndpoints
};
