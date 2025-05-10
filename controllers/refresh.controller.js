const refreshService = require("../services/refresh.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const getAll = async (req, res) => {
  try {
    const refreshTokens = await refreshService.getAllRefreshTokens();
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, refreshTokens);
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

const getUserTokens = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware auth
    const refreshTokens = await refreshService.getRefreshTokensByUserId(userId);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, refreshTokens);
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

const removeExpired = async (req, res) => {
  try {
    const count = await refreshService.removeExpiredTokens();
    sendResponse(res, STATUS.SUCCESS, `Đã xóa ${count} token hết hạn`);
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

const ApiRefreshController = {
  getAll,
  getUserTokens,
  removeExpired
};

module.exports = ApiRefreshController; 