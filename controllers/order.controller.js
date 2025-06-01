const orderService = require("../services/order.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const { PAGINATION } = require('../constants/pagination');

const getAll = async (req, res) => {
  try {
    const result = await orderService.getAllOrders();
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, result);
  } catch (error) {
    console.error("Controller error:", error);
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

const getAllByAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const sort = req.query.sort || 'DESC';    

    const result = await orderService.getAllOrdersByAdmin({page, limit, search, sort, status});
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, result);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      true
    );
  }
};

const create = async (req, res) => {  
  try {
    const { phone, items, total, name } = req.body;
    
    // Lấy io instance và adminSockets từ app
    const io = req.app.get('io');
    const adminSockets = req.app.get('adminSockets');
    
    const order = await orderService.createOrder(
      {phone, name, items, total},
      io,
      adminSockets
    );    
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
      {id: req.params.id,
      status: req.body.status,}
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
  getAllByAdmin
};

module.exports = ApiOrderController; 