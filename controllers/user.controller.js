const userService = require("../services/user.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");

const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, users);
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
    const user = await userService.createUser(req.body);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, user);
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
    const updatedUser = await userService.updateUser(
      req.params.id,
      req.body
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedUser);
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
    await userService.deleteUser(req.params.id);
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

const ApiUserController = {
  getAll,
  create,
  update,
  remove,
};

module.exports = ApiUserController; 