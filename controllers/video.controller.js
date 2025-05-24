const videoService = require("../services/video.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");

const getAll = async (req, res) => {
  try {
    const videos = await videoService.getAllVideos();

    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.GET_SUCCESS, videos);
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
    const videoData = { ...req.body };
    const video = await videoService.createVideo(videoData);
    sendResponse(res, STATUS.CREATED, MESSAGE.SUCCESS.CREATED, video);
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
    const videoId = req.params.id;
    const videoData = { ...req.body };

    const updatedVideo = await videoService.updateVideo(
      videoId,
      videoData
    );
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED, updatedVideo);
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
    await videoService.deleteVideo(req.params.id);
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

const ApiVideoController = {
  getAll,
  create,
  update,
  remove,
};

module.exports = ApiVideoController;
