const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const ApiBannerController = require("../controllers/banner.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { validate } = require('../middleware/validator');
const { MESSAGE } = require('../constants/messages')
const { BASE_ENDPOINT } = require('../constants/endpoints')
const upload = require('../utils/multer');

// Route public
router.get(BASE_ENDPOINT.BASE, ApiBannerController.getAll);

router.get(BASE_ENDPOINT.ADMIN_LIST, auth, isAdmin, ApiBannerController.getAllByAdmin);

router.get(BASE_ENDPOINT.GET_ONE, ApiBannerController.getOneBanner);

// Route với phân quyền admin
router.post(
 BASE_ENDPOINT.BASE, 
  auth, 
  isAdmin, 
  upload.single('image'),
  ApiBannerController.create
);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  isAdmin, 
  upload.single('image'),
  ApiBannerController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiBannerController.remove);

module.exports = router;