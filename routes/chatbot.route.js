const express = require("express");
const router = express.Router();
const { 
  processMessage, 
  searchProducts, 
  suggestProducts, 
  getBotInfo, 
  healthCheck 
} = require("../controllers/chatbot.controller");
const { validate } = require("../middleware/validator");
const { body, query } = require("express-validator");
const { CHATBOT_ENDPOINT } = require('../constants/endpoints')


// Validation rules
const messageValidation = [
  body('message')
    .notEmpty()
    .withMessage('Tin nhắn không được để trống')
    .isString()
    .withMessage('Tin nhắn phải là chuỗi')
    .isLength({ min: 1, max: 500 })
    .withMessage('Tin nhắn phải từ 1-500 ký tự')
];

const searchValidation = [
  query('query')
    .notEmpty()
    .withMessage('Từ khóa tìm kiếm không được để trống')
    .isString()
    .withMessage('Từ khóa phải là chuỗi')
    .isLength({ min: 1, max: 100 })
    .withMessage('Từ khóa phải từ 1-100 ký tự')
];

const categoryValidation = [
  query('category')
    .notEmpty()
    .withMessage('Tên danh mục không được để trống')
    .isString()
    .withMessage('Tên danh mục phải là chuỗi')
    .isLength({ min: 1, max: 50 })
    .withMessage('Tên danh mục phải từ 1-50 ký tự')
];

// Routes
// POST /api/chatbot/message - Xử lý tin nhắn từ user
router.post(CHATBOT_ENDPOINT.MESSAGE, validate, processMessage);

// GET /api/chatbot/search - Tìm kiếm sản phẩm theo từ khóa
router.get(CHATBOT_ENDPOINT.SEARCH, searchValidation, validate, searchProducts);

// GET /api/chatbot/suggest - Gợi ý sản phẩm theo danh mục
router.get(CHATBOT_ENDPOINT.SUGGEST, categoryValidation, validate, suggestProducts);

// GET /api/chatbot/info - Lấy thông tin bot
router.get(CHATBOT_ENDPOINT.INFO, getBotInfo);

// GET /api/chatbot/health - Health check
router.get(CHATBOT_ENDPOINT.HEALTH, healthCheck);

module.exports = router; 