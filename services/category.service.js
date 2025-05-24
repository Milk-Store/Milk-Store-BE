const { Category } = require('../models');

const getAllCategories = async () => {
  return await Category.findAll();
};

const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const updateCategory = async (id, categoryData) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error('Category not found');
  
  return await category.update(categoryData);
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error('Category not found');
  
  return await category.destroy();
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
