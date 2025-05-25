const express = require("express");
const router = express.Router();
const ApiUserController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { MESSAGE } = require('../constants/messages')
const { BASE_ENDPOINT } = require('../constants/endpoints')
// Route public - đăng ký tài khoản
router.post(
  BASE_ENDPOINT.REGISTER, 
  ApiUserController.create
);

// Route có xác thực
router.get(BASE_ENDPOINT.BASE, auth, isAdmin, ApiUserController.getAll);

router.put(
  BASE_ENDPOINT.BY_ID, 
  auth, 
  ApiUserController.update
);

router.delete(BASE_ENDPOINT.BY_ID, auth, isAdmin, ApiUserController.remove);

module.exports = router; 