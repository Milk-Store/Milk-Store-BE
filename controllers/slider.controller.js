const sliderService = require("../services/slider.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const getAll = async (req, res) => {
  try {
    const sliders = await sliderService.getAllSliders();

    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, sliders);
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
    const sliderData = { ...req.body };
    if (req.file) {
      const fileName = `slider_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(req.file, "sliders", fileName);
      sliderData.image = imageUrl;
    }
    const slider = await sliderService.createSlider(sliderData);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, slider);
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
    const sliderId = req.params.id;
    const sliderData = { ...req.body };

    if (req.file) {
      // Lấy thông tin sản phẩm cũ để xóa ảnh cũ nếu có
      const existingSlider = await sliderService.getSliderById(sliderId);
      if (existingSlider && existingSlider.image) {
        await deleteFromCloudinary(existingSlider.image);
      }

      // Upload ảnh mới
      const fileName = `slider_${sliderId}_${Date.now()}`;
      const imageUrl = await uploadToCloudinary(req.file, "sliders", fileName);
      sliderData.image = imageUrl;
    }
    const updatedSlider = await sliderService.updateSlider(
      sliderId,
      sliderData
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedSlider);
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
    await sliderService.deleteSlider(req.params.id);
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

const ApiSliderController = {
  getAll,
  create,
  update,
  remove,
};

module.exports = ApiSliderController;
