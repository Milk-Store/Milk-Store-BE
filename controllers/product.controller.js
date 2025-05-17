const productService = require("../services/product.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

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
    const productData = { ...req.body };
    
    // Upload hình ảnh nếu có
    if (req.file) {
      const fileName = `product_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(req.file, 'products', fileName);
      productData.image = imageUrl;
    }
    
    const product = await productService.createProduct(productData);
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
    const productId = req.params.id;
    const productData = { ...req.body };
    
    // Nếu có file ảnh mới
    if (req.file) {
      // Lấy thông tin sản phẩm cũ để xóa ảnh cũ nếu có
      const existingProduct = await productService.getProductById(productId);
      if (existingProduct && existingProduct.image) {
        await deleteFromCloudinary(existingProduct.image);
      }
      
      // Upload ảnh mới
      const fileName = `product_${productId}_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(req.file, 'products', fileName);
      productData.image = imageUrl;
    }
    
    const updatedProduct = await productService.updateProduct(productId, productData);
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
    const productId = req.params.id;
    
    // Lấy thông tin sản phẩm để xóa ảnh nếu có
    const product = await productService.getProductById(productId);
    if (product && product.image) {
      await deleteFromCloudinary(product.image);
    }
    
    await productService.deleteProduct(productId);
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

const show = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    if (!product) {
      return sendResponse(res, STATUS.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND);
    }
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, product);
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
  show,
};

module.exports = ApiProductController; 