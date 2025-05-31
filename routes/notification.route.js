const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const NotificationService = require('../services/notification.service');
const sendResponse = require('../utils/responseFormatter');
const { STATUS } = require('../constants/httpStatusCodes');
const { MESSAGE } = require('../constants/messages');

// Đăng ký push token cho admin user
router.post('/register-token', auth, isAdmin, async (req, res) => {  
  try {
    const { pushToken } = req.body;
    const userId = req.user.id;
    
    await NotificationService.saveAdminPushToken(userId, pushToken);
    
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED);
  } catch (error) {
    console.error('Error registering push token:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      error.message
    );
  }
});

// Hủy đăng ký push token
router.post('/unregister-token', auth, isAdmin, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await NotificationService.removeAdminPushToken(userId);
    
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED);
  } catch (error) {
    console.error('Error unregistering push token:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      MESSAGE.ERROR.INTERNAL,
      null,
      false,
      error.message
    );
  }
});

router.post('/test-notification', async (req, res) => {
  try {
    await NotificationService.sendTestNotification();
    sendResponse(res, STATUS.SUCCESS, MESSAGE.SUCCESS.UPDATED);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
})

module.exports = router; 