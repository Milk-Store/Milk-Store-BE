const { User } = require('../models');
const bcrypt = require('bcrypt');

User.hashPassword = async function(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const getAllUsers = async () => {
  return await User.findAll();
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  if(userData.password) {
    userData.password = await User.hashPassword(userData.password);
  }
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