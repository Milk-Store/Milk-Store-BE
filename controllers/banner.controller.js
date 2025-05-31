const bannerService = require("../services/banner.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const getAll = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();    
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, banners);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      true
    );
  }
};

const getAllByAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await bannerService.getAllBannersByAdmin(page, limit, search);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, result);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      true
    );
  }
};

const getOneBanner = async (req, res) => {
    try {
        const banner = await bannerService.getOneBannerActive();
        
        sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, banner);
    } catch (error) {
        sendResponse(
            res,
            STATUS.SERVER_ERROR,
            MESSAGE.ERROR.INTERNAL,
            null,
            false,
            true
        );
    }
};

const create = async (req, res) => {
  try {
    const bannerData = { ...req.body };
    if (req.file) {
      const fileName = `banner_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(
        req.file,
        "banners",
        fileName
      );
      bannerData.image = imageUrl;
    }
    const banner = await bannerService.createBanner(bannerData);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, banner);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      true
    );
  }
};

const update = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const bannerData = { ...req.body };

    if (req.file) {
      // Lấy thông tin sản phẩm cũ để xóa ảnh cũ nếu có
      const existingBanner = await bannerService.getBannerById(
        bannerId
      );
      if (existingBanner && existingBanner.image) {
        await deleteFromCloudinary(existingBanner.image);
      }

      // Upload ảnh mới
      const fileName = `banner_${bannerId}_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(
        req.file,
        "banners",
        fileName
      );
      bannerData.image = imageUrl;
    }
    const updatedBanner = await bannerService.updateBanner(
      bannerId,
      bannerData
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedBanner);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      true
    );
  }
};

const remove = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.DELETED);
  } catch (error) {
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      true
    );
  }
};

const ApiBannerController = {
  getAll,
  create,
  update,
  remove,
  getAllByAdmin,
  getOneBanner
};

module.exports = ApiBannerController;
