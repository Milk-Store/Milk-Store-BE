const bcrypt = require('bcrypt');
const { User } = require('../models');
const { AUTH } = require('../constants/auth');

/**
 * Seed tài khoản admin mặc định
 */
const createAdminUser = async () => {
  try {
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({
      where: { 
        email: process.env.ADMIN_EMAIL,
        role: AUTH.ROLES.ADMIN
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Tạo mật khẩu hash
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD, 
      10
    );

    // Tạo tài khoản admin
    await User.create({
      name: 'Administrator',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: AUTH.ROLES.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = { createAdminUser }; 