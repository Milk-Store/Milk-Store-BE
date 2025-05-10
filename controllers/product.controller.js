const productService = require("../services/product.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");

const getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
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

const create = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, product);
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
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedProduct);
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
    await productService.deleteProduct(req.params.id);
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

const ApiProductController = {
  getAll,
  create,
  update,
  remove,
};

module.exports = ApiProductController; 