const { Op } = require('sequelize');
const { Product } = require('../models');

const getAllProducts = async () => {
  return await Product.findAll();
};

const getAllProductsByAdmin = async (page = 1, limit = 10, search = '', category_id = null) => {
  const offset = (page - 1) * limit;
  
  const whereClause = {};
  
  if (search) {
    whereClause.name = {
      [Op.like]: `%${search}%`
    };
  }
  
  if (category_id) {
    whereClause.category_id = category_id;
  }

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    itemsPerPage: limit,
    products: rows
  };
};


const getProductById = async (id) => {
  return await Product.findByPk(id);
};

const createProduct = async (productData) => {
  return await Product.create(productData);
};

const updateProduct = async (id, productData) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  
  return await product.update(productData);
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');
  
  return await product.destroy();
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsByAdmin
}; 