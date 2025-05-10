const categoryService = require("../services/category.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, categories);
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
    const category = await categoryService.createCategory(req.body);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, category);
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
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedCategory);
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
    await categoryService.deleteCategory(req.params.id);
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

const ApiCategoryController = {
  getAll,
  create,
  update,
  remove,
};

module.exports = ApiCategoryController;
