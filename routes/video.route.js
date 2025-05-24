const express = require("express");
const router = express.Router();
const ApiVideoController = require("../controllers/video.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { BASE_ENDPOINT } = require('../constants/endpoints');
// Route public
router.get(BASE_ENDPOINT.BASE, ApiVideoController.getAll);

// Route với phân quyền admin
router.post(
  BASE_ENDPOINT.BASE, 
  auth, 
  isAdmin, 
  ApiVideoController.create
);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  isAdmin, 
  ApiVideoController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiVideoController.remove);

module.exports = router;