const { Post } = require('../models');

const getAllPosts = async () => {
  try {
    return await Post.findAll({
      where: {
        deletedAt: null
      }
    });
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw error;
  }
}

const getPostById = async (id) => {
  try {
    return await Post.findOne({
      where: {
        id,
        deletedAt: null
      }
    });
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw error;
  }
}

const createPost = async (postData) => {
  try {
    return await Post.create({
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error;
  }
}

const updatePost = async (id, postData) => {
  try {
    const post = await Post.findOne({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return await post.update({
      ...postData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw error;
  }
}

const deletePost = async (id) => {
  try {
    const post = await Post.findOne({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Soft delete by setting deletedAt
    return await post.update({
      deletedAt: new Date()
    });
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
}
