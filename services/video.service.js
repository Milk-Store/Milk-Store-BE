const { Video } = require("../models");

const getAllVideos = async () => {
  return await Video.findAll({
    where: { status: true },
  });
};

const getVideoById = async (id) => {
  return await Video.findByPk(id);
};

const createVideo = async (videoData) => {
  return await Video.create(videoData);
};

const updateVideo = async (id, videoData) => {
  const video = await Video.findByPk(id);
  if (!video) throw new Error("Video not found");

  return await video.update(videoData);
};

const deleteVideo = async (id) => {
  const video = await Video.findByPk(id);
  if (!video) throw new Error("Video not found");

  return await video.destroy();
};

module.exports = {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoById,
};
