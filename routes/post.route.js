const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { MESSAGE } = require('../constants/messages')
const { BASE_ENDPOINT } = require('../constants/endpoints')
const upload = require('../utils/multer');
const ApiPostController = require("../controllers/post.controller");

// Public routes
router.get(BASE_ENDPOINT.BASE, ApiPostController.getAll);
router.get(`${BASE_ENDPOINT.BASE}/:id`, ApiPostController.getById);

// Protected routes (Admin only)
router.post(
  BASE_ENDPOINT.BASE,
  auth,
  isAdmin,
  upload.single('thumbnail'),
  ApiPostController.create
);

router.put(
  `${BASE_ENDPOINT.BASE}/:id`,
  auth,
  isAdmin,
  upload.single('thumbnail'),
  ApiPostController.update
);

router.delete(
  `${BASE_ENDPOINT.BASE}/:id`,
  auth,
  isAdmin,
  ApiPostController.remove
);

module.exports = router;