const categoryService = require("../services/category.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

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
      true
    );
  }
};

const getAllByAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await categoryService.getAllCategoriesByAdmin(page, limit, search);
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
    const categoryData = { ...req.body };
    if (req.file) {
      const fileName = `category_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(
        req.file,
        "categories",
        fileName
      );
      categoryData.image = imageUrl;
    }
    const category = await categoryService.createCategory(categoryData);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, category);
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

const update = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = { ...req.body };

    if (req.file) {
      // Lấy thông tin sản phẩm cũ để xóa ảnh cũ nếu có
      const existingCategory = await categoryService.getCategoryById(
        categoryId
      );
      if (existingCategory && existingCategory.image) {
        await deleteFromCloudinary(existingCategory.image);
      }

      // Upload ảnh mới
      const fileName = `category_${productId}_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(
        req.file,
        "categories",
        fileName
      );
      categoryData.image = imageUrl;
    }
    const updatedCategory = await categoryService.updateCategory(
      categoryId,
      categoryData
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedCategory);
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
      true
    );
  }
};

const ApiCategoryController = {
  getAll,
  create,
  update,
  remove,
  getAllByAdmin
};

module.exports = ApiCategoryController;
