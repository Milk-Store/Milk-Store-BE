const analyticsService = require("../services/analytics.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");

const getDashboardOverview = async (req, res) => {
  try {
    const { fromDate, toDate, year } = req.query;

    const overview = await analyticsService.getDashboardOverview({
      fromDate,
      toDate,
      year
    });

    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, overview);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      error.message
    );
  }
};

const getOrderStatistics = async (req, res) => {
  try {
    const { fromDate, toDate, year } = req.query;
    const statistics = await analyticsService.getOrderStatistics({
      fromDate,
      toDate,
      year
    });
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, statistics);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      error.message
    );
  }
};

const getOrderStatusStatistics = async (req, res) => {
  try {
    const { fromDate, toDate, year } = req.query;
    const statistics = await analyticsService.getOrderStatusStatistics({
      fromDate,
      toDate,
      year
    });
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, statistics);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      error.message
    );
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const products = await analyticsService.getTopSellingProducts(limit);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, products);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      error.message
    );
  }
};

const ApiAnalyticsController = {
  getDashboardOverview,
  getOrderStatistics,
  getOrderStatusStatistics,
  getTopSellingProducts
};

module.exports = ApiAnalyticsController;
