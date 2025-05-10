const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiCategoryController = require("../controllers/category.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validate } = require('../middleware/validator');

// Route public
router.get("/", ApiCategoryController.getAll);

// Route với phân quyền admin
router.post(
  "/", 
  auth, 
  isAdmin, 
  [
    body('name').notEmpty().withMessage('Tên danh mục là bắt buộc')
  ],
  validate,
  ApiCategoryController.create
);

router.put(
  "/:id", 
  auth, 
  isAdmin, 
  [
    body('name').notEmpty().withMessage('Tên danh mục là bắt buộc')
  ],
  validate,
  ApiCategoryController.update
);

router.delete("/:id", auth, isAdmin, ApiCategoryController.remove);

module.exports = router;