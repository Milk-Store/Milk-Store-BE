const postService = require("../services/post.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const getAll = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, posts);
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

    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, post);
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
    const { title, content } = req.body;
    const thumbnail = req.file;
    let thumbnailUrl = '';

    // Upload thumbnail if provided
    if (thumbnail) {
      const uploadResult = await uploadToCloudinary(thumbnail.path);
      thumbnailUrl = uploadResult.url;
    }

    const postData = {
      title,
      content, // This will be markdown content
      thumbnail: thumbnailUrl,
      createdBy: req.user.id // Assuming we have user info from auth middleware
    };

    const newPost = await postService.createPost(postData);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATE_SUCCESS, newPost);
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
    const { id } = req.params;
    const { title, content } = req.body;
    const thumbnail = req.file;
    
    // Get existing post
    const existingPost = await postService.getPostById(id);
    if (!existingPost) {
      return sendResponse(
        res,
        STATUS.NOT_FOUND,
        MESSAGE.ERROR.NOT_FOUND,
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
      const uploadResult = await uploadToCloudinary(thumbnail.path);
      thumbnailUrl = uploadResult.url;
    }

    const postData = {
      title,
      content,
      thumbnail: thumbnailUrl
    };

    const updatedPost = await postService.updatePost(id, postData);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATE_SUCCESS, updatedPost);
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

    await postService.deletePost(id);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.DELETE_SUCCESS, null);
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

const ApiPostController = {
  getAll,
  getById,
  create,
  update,
  remove
};

module.exports = ApiPostController;
