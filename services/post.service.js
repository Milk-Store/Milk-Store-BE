const { Post, User } = require('../models');
const { Op } = require('sequelize');
const { 
  POST_STATUS, 
  POST_SORT_FIELDS, 
  POST_SORT_ORDERS, 
  POST_DEFAULT_PAGINATION 
} = require('../constants/posts');
const slugify = require('slugify');

const getAllPosts = async (query = {}) => {
  try {
    const {
      page = POST_DEFAULT_PAGINATION.PAGE,
      limit = POST_DEFAULT_PAGINATION.LIMIT,
      status,
      featured,
      search,
      sortBy = POST_SORT_FIELDS.CREATED_AT,
      sortOrder = POST_SORT_ORDERS.DESC
    } = query;

    const offset = (page - 1) * limit;
    const whereClause = {
      deletedAt: null
    };

    // Filter by status
    if (status && Object.values(POST_STATUS).includes(status)) {
      whereClause.status = status;
    }

    // Filter by featured
    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    // Search by title or content
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      posts: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
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
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
      ]
    });
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw error;
  }
}

const getPublishedPosts = async (query = {}) => {
  try {
    const {
      page = POST_DEFAULT_PAGINATION.PAGE,
      limit = POST_DEFAULT_PAGINATION.LIMIT,
      featured,
      search,
      sortBy = POST_SORT_FIELDS.PUBLISHED_AT,
      sortOrder = POST_SORT_ORDERS.DESC
    } = query;

    const offset = (page - 1) * limit;
    const whereClause = {
      deletedAt: null,
      status: POST_STATUS.PUBLISHED
    };

    // Filter by featured
    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    // Search by title or excerpt
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      posts: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    console.error("Error in getPublishedPosts:", error);
    throw error;
  }
}

// Hàm sinh slug duy nhất
async function generateUniqueSlug(title, id = null) {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;
  let where = { slug };
  if (id) where.id = { [Op.ne]: id };
  while (await Post.findOne({ where })) {
    slug = `${baseSlug}-${count++}`;
    where.slug = slug;
  }
  return slug;
}

const createPost = async (postData) => {
  try {
    const { images, ...postFields } = postData;
    
    // Set default status if not provided
    if (!postFields.status) {
      postFields.status = POST_STATUS.DRAFT;
    }
    
    // Sinh slug
    let slug = postFields.slug;
    if (!slug) {
      slug = await generateUniqueSlug(postFields.title);
    }
    postFields.slug = slug;
    
    // Tạo bài viết
    const post = await Post.create({
      ...postFields,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Trả về bài viết với images
    return await getPostById(post.id);
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error;
  }
}

const updatePost = async (id, postData) => {
  try {
    const { images, ...postFields } = postData;
    
    const post = await Post.findOne({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Sinh slug nếu có title mới hoặc slug mới
    let slug = postFields.slug;
    if (!slug && postFields.title) {
      slug = await generateUniqueSlug(postFields.title, id);
    }
    if (slug) postFields.slug = slug;

    // Cập nhật bài viết
    await post.update({
      ...postFields,
      updatedAt: new Date()
    });

    // Trả về bài viết với images
    return await getPostById(id);
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

    // Soft delete bài viết
    await post.destroy({where: {id}})

    return true;
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  }
}

const updatePostStatus = async (id, status) => {
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

    // Validate status
    if (!Object.values(POST_STATUS).includes(status)) {
      throw new Error('Invalid post status');
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Nếu publish, set publishedAt
    if (status === POST_STATUS.PUBLISHED && post.status !== POST_STATUS.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    await post.update(updateData);
    return await getPostById(id);
  } catch (error) {
    console.error("Error in updatePostStatus:", error);
    throw error;
  }
}

const incrementViewCount = async (id) => {
  try {
    const post = await Post.findOne({
      where: {
        id,
        deletedAt: null,
        status: POST_STATUS.PUBLISHED
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    await post.increment('viewCount');
    return await getPostById(id);
  } catch (error) {
    console.error("Error in incrementViewCount:", error);
    throw error;
  }
}

const toggleFeatured = async (id) => {
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

    await post.update({
      featured: !post.featured,
      updatedAt: new Date()
    });

    return await getPostById(id);
  } catch (error) {
    console.error("Error in toggleFeatured:", error);
    throw error;
  }
}

const getPostBySlug = async (slug) => {
  try {
    return await Post.findOne({
      where: {
        slug,
        deletedAt: null
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        },
      ]
    });
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    throw error;
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostBySlug,
  getPublishedPosts,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
  incrementViewCount,
  toggleFeatured
}
