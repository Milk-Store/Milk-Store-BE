const express = require("express");
const router = express.Router();
const ApiSliderController = require("../controllers/slider.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { BASE_ENDPOINT } = require('../constants/endpoints');
// Route public
router.get(BASE_ENDPOINT.BASE, ApiSliderController.getAll);

// Route với phân quyền admin
router.post(
  BASE_ENDPOINT.BASE, 
  auth, 
  isAdmin, 
  ApiSliderController.create
);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  isAdmin, 
  ApiSliderController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiSliderController.remove);

module.exports = router;