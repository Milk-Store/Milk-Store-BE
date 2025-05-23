const orderService = require("../services/order.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const { PAGINATION } = require('../constants/pagination');

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
    const orders = await orderService.getAllOrders(page, limit);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, orders);
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

const create = async (req, res) => {
  try {
    const { orderData, orderItems } = req.body;
    const order = await orderService.createOrder(orderData, orderItems);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, order);
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

const update = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrder(
      req.params.id,
      req.body
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedOrder);
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

const remove = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.DELETED);
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

const ApiOrderController = {
  getAll,
  create,
  update,
  remove,
};

module.exports = ApiOrderController; 