const { Category } = require('../models');

const getAllCategories = async () => {
  return await Category.findAll();
};

const getAllCategoriesByAdmin = async (page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;
  
  const whereClause = {};
  
  if (search) {
    whereClause.name = {
      [Op.like]: `%${search}%`
    };
  }

  const { count, rows } = await Category.findAndCountAll({
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
    categories: rows
  };
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
  getAllCategoriesByAdmin
};
