const { Slider } = require('../models');

const getAllSliders = async () => {
  return await Slider.findAll({
    where: { status: true },
    order: [['order', 'ASC']],
  });
};

const getSliderById = async (id) => {
  return await Slider.findByPk(id);
};

const createSlider= async (sliderData) => {
  return await Slider.create(sliderData);
};

const updateSlider = async (id, sliderData) => {
  const slider = await Slider.findByPk(id);
  if (!slider) throw new Error('Slider not found');
  
  return await slider.update(sliderData);
};

const deleteSlider = async (id) => {
  const slider = await Slider.findByPk(id);
  if (!slider) throw new Error('Slider not found');
  
  return await slider.destroy();
};

module.exports = {
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  getSliderById,
};
