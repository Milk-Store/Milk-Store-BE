const { User } = require('../models');

const getAllUsers = async () => {
  return await User.findAll();
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  
  return await user.update(userData);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  
  return await user.destroy();
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
}; 