const { Product } = require('../models');

const getAllProducts = async () => {
  return await Product.findAll();
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
  createProduct,
  updateProduct,
  deleteProduct,
}; 