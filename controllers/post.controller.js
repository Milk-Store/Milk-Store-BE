const postService = require("../services/post.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const { POST_STATUS } = require("../constants/posts");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const { generatePostAI } = require('../services/ai.service');

// Public routes
const getAll = async (req, res) => {
  try {
    const result = await postService.getAllPosts(req.query);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, result);
  } catch (error) {
    console.error("Error in getAll posts:", error);
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

const getPublished = async (req, res) => {
  try {
    const result = await postService.getPublishedPosts(req.query);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, result);
  } catch (error) {
    console.error("Error in getPublished posts:", error);
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

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    
    if (!post) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.NOT_FOUND,
        null
      );
    }

    // Tăng view count nếu là bài viết đã publish
    if (post.status === POST_STATUS.PUBLISHED) {
      await postService.incrementViewCount(id);
    }

    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, post);
  } catch (error) {
    console.error("Error in getById post:", error);
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

const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await postService.getPostBySlug(slug);
    if (!post) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.NOT_FOUND,
        null
      );
    }
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, post);
  } catch (error) {
    console.error('Error in getBySlug post:', error);
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

// Admin routes
const create = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      status = POST_STATUS.DRAFT,
      metaTitle,
      metaDescription,
      featured = false,
      images,
      slug
    } = req.body;

    const thumbnail = req.file;
    let thumbnailUrl = '';

    // Upload thumbnail if provided
    if (thumbnail) {
      const uploadResult = await uploadToCloudinary(thumbnail, 'posts/thumbnails', `thumb_${Date.now()}`);
      thumbnailUrl = uploadResult;
    }

    const postData = {
      title,
      content, // HTML content from React Quill
      excerpt,
      thumbnail: thumbnailUrl,
      status,
      metaTitle,
      metaDescription,
      featured: featured === 'true' || featured === true,
      createdBy: req.user.id,
      images: images ? JSON.parse(images) : [],
      slug
    };

    const newPost = await postService.createPost(postData);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.POST_CREATED, newPost);
  } catch (error) {
    console.error("Error in create post:", error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.POST_CREATE_FAILED,
      null,
      false,
      true
    );
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      status,
      metaTitle,
      metaDescription,
      featured,
      images,
      slug
    } = req.body;

    const thumbnail = req.file;
    
    // Get existing post
    const existingPost = await postService.getPostById(id);
    if (!existingPost) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.POST_NOT_FOUND,
        null
      );
    }

    let thumbnailUrl = existingPost.thumbnail;

    // Upload new thumbnail if provided
    if (thumbnail) {
      // Delete old thumbnail if exists
      if (existingPost.thumbnail) {
        await deleteFromCloudinary(existingPost.thumbnail);
      }
      const uploadResult = await uploadToCloudinary(thumbnail, 'posts/thumbnails', `thumb_${Date.now()}`);
      thumbnailUrl = uploadResult;
    }

    const postData = {
      title,
      content,
      excerpt,
      thumbnail: thumbnailUrl,
      status,
      metaTitle,
      metaDescription,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : undefined,
      images: images ? JSON.parse(images) : undefined,
      slug
    };

    const updatedPost = await postService.updatePost(id, postData);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.POST_UPDATED, updatedPost);
  } catch (error) {
    console.error("Error in update post:", error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.POST_UPDATE_FAILED,
      null,
      false,
      true
    );
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await postService.getPostById(id);
    if (!post) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.POST_NOT_FOUND,
        null
      );
    }

    // Delete thumbnail from Cloudinary if exists
    if (post.thumbnail) {
      await deleteFromCloudinary(post.thumbnail);
    }

    await postService.deletePost(id);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.POST_DELETED, null);
  } catch (error) {
    console.error("Error in remove post:", error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.POST_DELETE_FAILED,
      null,
      false,
      true
    );
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(POST_STATUS).includes(status)) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        MESSAGE.ERROR.INVALID_POST_STATUS,
        null
      );
    }

    const post = await postService.getPostById(id);
    if (!post) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.POST_NOT_FOUND,
        null
      );
    }

    const updatedPost = await postService.updatePostStatus(id, status);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.POST_STATUS_UPDATED, updatedPost);
  } catch (error) {
    console.error("Error in updateStatus post:", error);
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

const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postService.getPostById(id);
    if (!post) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.POST_NOT_FOUND,
        null
      );
    }

    const updatedPost = await postService.toggleFeatured(id);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.POST_FEATURED_TOGGLED, updatedPost);
  } catch (error) {
    console.error("Error in toggleFeatured post:", error);
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

// Upload image for React Quill editor
const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        MESSAGE.ERROR.INVALID_IMAGE_FORMAT,
        null
      );
    }

    const uploadResult = await uploadToCloudinary(file, 'posts/content', `content_${Date.now()}`);
    
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.IMAGE_UPLOADED, {
      url: uploadResult,
      alt: file.originalname
    });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.IMAGE_UPLOAD_FAILED,
      null,
      false,
      true
    );
  }
};

// AI generate content
const generateAIContent = async (req, res) => {
  try {
    const { topic, keywords, description } = req.body;
    if (!topic) {
      return sendResponse(res, STATUS.BAD_REQUEST, 'Vui lòng nhập chủ đề bài viết!', null, false, true);
    }
    const aiResult = await generatePostAI({ topic, keywords, description });
    sendResponse(res, STATUS.SUCCESS, 'Sinh nội dung AI thành công!', { aiResult });
  } catch (error) {
    console.error('Error in generateAIContent:', error);
    sendResponse(res, STATUS.SERVER_ERROR, 'Lỗi sinh nội dung AI!', null, false, true);
  }
};

const ApiPostController = {
  // Public routes
  getAll,
  getPublished,
  getById,
  getBySlug,
  
  // Admin routes
  create,
  update,
  remove,
  updateStatus,
  toggleFeatured,
  uploadImage,
  generateAIContent
};

module.exports = ApiPostController;
