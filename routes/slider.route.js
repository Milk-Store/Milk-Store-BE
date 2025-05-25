const express = require("express");
const router = express.Router();
const ApiSliderController = require("../controllers/slider.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { BASE_ENDPOINT } = require('../constants/endpoints');
const upload = require('../utils/multer');

// Route public
router.get(BASE_ENDPOINT.BASE, ApiSliderController.getAll);
router.get(BASE_ENDPOINT.ADMIN_LIST, auth, isAdmin, ApiSliderController.getAllByAdmin);

// Route với phân quyền admin
router.post(
  BASE_ENDPOINT.BASE, 
  auth, 
  isAdmin, 
  upload.single('image'),
  ApiSliderController.create
);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  isAdmin, 
  upload.single('image'),
  ApiSliderController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiSliderController.remove);

module.exports = router;