const { Op } = require('sequelize');
const { Banner } = require('../models');

const getAllBanners = async () => {
  return await Banner.findAll();
};

const getOneBannerActive = async () => {
    return await Banner.findOne({
        where: { status: true },
    });
};

const getAllBannersByAdmin = async (page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;
  
  const whereClause = {};
  
  if (search) {
    whereClause.name = {
      [Op.like]: `%${search}%`
    };
  }

  const { count, rows } = await Banner.findAndCountAll({
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
    Banners: rows
  };
};

const getBannerById = async (id) => {
  return await Banner.findByPk(id);
};

const createBanner = async (bannerData) => {
  return await Banner.create(bannerData);
};

const updateBanner = async (id, bannerData) => {
  const banner = await Banner.findByPk(id);
  if (!banner) throw new Error('Banner not found');
  
  return await banner.update(bannerData);
};

const deleteBanner = async (id) => {
  const banner = await Banner.findByPk(id);
  if (!banner) throw new Error('Banner not found');
  
  return await banner.destroy();
};

module.exports = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerById,
  getAllBannersByAdmin,
  getOneBannerActive
};
