const { RefreshToken } = require('../models');
const { Op } = require('sequelize');

// Lấy tất cả refresh token (chỉ dành cho admin)
const getAllRefreshTokens = async () => {
  return await RefreshToken.findAll();
};

// Lấy tất cả refresh token của một user
const getRefreshTokensByUserId = async (userId) => {
  return await RefreshToken.findAll({
    where: { user_id: userId }
  });
};

// Kiểm tra token có tồn tại và hợp lệ không
const verifyToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({
    where: { 
      token: token,
      is_used: false
    }
  });
  
  if (!refreshToken) {
    return { valid: false, message: 'Token không tồn tại hoặc đã được sử dụng' };
  }
  
  // Kiểm tra hết hạn
  const now = new Date();
  if (now > refreshToken.expires_at) {
    return { valid: false, message: 'Token đã hết hạn' };
  }
  
  return { valid: true, token: refreshToken };
};

// Đánh dấu token đã sử dụng
const markTokenAsUsed = async (tokenId) => {
  const token = await RefreshToken.findByPk(tokenId);
  if (!token) throw new Error('Token không tồn tại');
  
  return await token.update({ is_used: true });
};

// Xóa tất cả token đã hết hạn
const removeExpiredTokens = async () => {
  const now = new Date();
  return await RefreshToken.destroy({
    where: {
      expires_at: { [Op.lt]: now }
    }
  });
};

module.exports = {
  getAllRefreshTokens,
  getRefreshTokensByUserId,
  verifyToken,
  markTokenAsUsed,
  removeExpiredTokens
}; 