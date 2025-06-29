const { validationResult } = require('express-validator');
const sendResponse = require('../utils/responseFormatter');
const { STATUS } = require('../constants/httpStatusCodes');
const { MESSAGE } = require('../constants/messages');
const { POST_STATUS, POST_VALIDATION, POST_IMAGE_VALIDATION } = require('../constants/posts');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      'Dữ liệu không hợp lệ',
      null,
      false,
      errors.array()
    );
  }
  next();
};

// Validate Post creation/update
const validatePost = (req, res, next) => {
  const { title, content, status } = req.body;

  // Validate title
  if (!title || title.trim().length === 0) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.POST_TITLE_REQUIRED,
      null,
      false
    );
  }

  if (title.trim().length < POST_VALIDATION.TITLE_MIN_LENGTH) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.MIN_LENGTH('Tiêu đề', POST_VALIDATION.TITLE_MIN_LENGTH),
      null,
      false
    );
  }

  if (title.trim().length > POST_VALIDATION.TITLE_MAX_LENGTH) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.MAX_LENGTH('Tiêu đề', POST_VALIDATION.TITLE_MAX_LENGTH),
      null,
      false
    );
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.POST_CONTENT_REQUIRED,
      null,
      false
    );
  }

  if (content.trim().length < POST_VALIDATION.CONTENT_MIN_LENGTH) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.MIN_LENGTH('Nội dung', POST_VALIDATION.CONTENT_MIN_LENGTH),
      null,
      false
    );
  }

  // Validate status if provided
  if (status && !Object.values(POST_STATUS).includes(status)) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.POST_STATUS_INVALID,
      null,
      false
    );
  }

  next();
};

// Validate Post status update
const validatePostStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.REQUIRED('Trạng thái'),
      null,
      false
    );
  }

  if (!Object.values(POST_STATUS).includes(status)) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.POST_STATUS_INVALID,
      null,
      false
    );
  }

  next();
};

// Validate Post ID parameter
const validatePostId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.VALIDATION.INVALID('ID bài viết'),
      null,
      false
    );
  }

  next();
};

// Validate image upload
const validateImageUpload = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.ERROR.INVALID_IMAGE_FORMAT,
      null,
      false
    );
  }

  // Check file type
  if (!POST_IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.mimetype)) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      MESSAGE.ERROR.INVALID_IMAGE_FORMAT,
      null,
      false
    );
  }

  // Check file size
  if (file.size > POST_IMAGE_VALIDATION.MAX_SIZE) {
    return sendResponse(
      res,
      STATUS.BAD_REQUEST,
      `Kích thước ảnh không được vượt quá ${POST_IMAGE_VALIDATION.MAX_SIZE / (1024 * 1024)}MB`,
      null,
      false
    );
  }

  next();
};

module.exports = {
  validate,
  validatePost,
  validatePostStatus,
  validatePostId,
  validateImageUpload
}; 