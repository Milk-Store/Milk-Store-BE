const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validatePost, validatePostStatus, validatePostId, validateImageUpload } = require("../middleware/validator");
const { MESSAGE } = require('../constants/messages')
const { BASE_ENDPOINT, POST_ENDPOINT } = require('../constants/endpoints')
const upload = require('../utils/multer');
const ApiPostController = require("../controllers/post.controller");

// Public routes

router.get(BASE_ENDPOINT.BASE, ApiPostController.getAll);
router.get(POST_ENDPOINT.PUBLISHED, ApiPostController.getPublished);

// Lấy bài viết theo slug
router.get(POST_ENDPOINT.SLUG, ApiPostController.getBySlug);

router.get(BASE_ENDPOINT.BY_ID, ApiPostController.getById);


// Protected routes (Admin only)
router.post(
  BASE_ENDPOINT.BASE,
  auth,
  isAdmin,
  upload.single('thumbnail'),
  ApiPostController.create
);

router.put(
  BASE_ENDPOINT.BY_ID,
  auth,
  isAdmin,
  validatePostId,
  upload.single('thumbnail'),
  validatePost,
  ApiPostController.update
);

router.delete(
  BASE_ENDPOINT.BY_ID,
  auth,
  isAdmin,
  validatePostId,
  ApiPostController.remove
);

// Admin management routes
router.patch(
  `${BASE_ENDPOINT.BY_ID}${POST_ENDPOINT.STATUS}`,
  auth,
  isAdmin,
  validatePostId,
  validatePostStatus,
  ApiPostController.updateStatus
);

router.patch(
  `${BASE_ENDPOINT.BY_ID}${POST_ENDPOINT.FEATURED}`,
  auth,
  isAdmin,
  validatePostId,
  ApiPostController.toggleFeatured
);

// Upload image for React Quill editor
router.post(
  `${BASE_ENDPOINT.BY_ID}${POST_ENDPOINT.UPLOAD_IMAGE}`,
  auth,
  isAdmin,
  upload.single('image'),
  validateImageUpload,
  ApiPostController.uploadImage
);

// Sinh nội dung AI cho bài viết
router.post(
  POST_ENDPOINT.GENERATE_AI_CONTENT,
  auth,
  isAdmin,
  ApiPostController.generateAIContent
);

module.exports = router;