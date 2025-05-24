const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiProductController = require("../controllers/product.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validate } = require('../middleware/validator');
const upload = require('../utils/multer');
const { MESSAGE } = require('../constants/messages')
const { BASE_ENDPOINT } = require('../constants/endpoints')
// Route public
router.get(BASE_ENDPOINT.BASE, ApiProductController.getAll);
router.get(BASE_ENDPOINT.BY_ID, ApiProductController.show);

// Route với phân quyền admin
router.get(BASE_ENDPOINT.ADMIN_LIST, auth, isAdmin, ApiProductController.getAllByAdmin);

router.post(
  BASE_ENDPOINT.BASE, 
  auth, 
  isAdmin, 
  upload.single('image'),
  [
    body('name').notEmpty().withMessage(MESSAGE.VALIDATION.REQUIRED('Tên sản phẩm')),
    body('price').isFloat({ min: 0 }).withMessage(MESSAGE.VALIDATION.MUST_BE_POSITIVE_NUMBER('Giá')),
    body('category_id').isInt({ min: 1 }).withMessage(MESSAGE.VALIDATION.INVALID('Danh mục'))
  ],
  validate,
  ApiProductController.create
);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  isAdmin, 
  upload.single('image'),
  [
    body('name').optional().notEmpty().withMessage(MESSAGE.VALIDATION.REQUIRED('Tên sản phẩm')),
    body('price').optional().isFloat({ min: 0 }).withMessage(MESSAGE.VALIDATION.MUST_BE_POSITIVE_NUMBER('Giá')),
    body('category_id').optional().isInt({ min: 1 }).withMessage(MESSAGE.VALIDATION.INVALID('Danh mục'))
  ],
  validate,
  ApiProductController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiProductController.remove);

module.exports = router; 