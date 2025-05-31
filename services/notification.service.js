const { Expo } = require('expo-server-sdk');
const { User } = require('../models');

// Khởi tạo instance của Expo SDK
const expo = new Expo();

// Lưu trữ push tokens của admin users
let adminPushTokens = new Map();

const NotificationService = {
  // Lưu push token cho một admin user
  saveAdminPushToken: async (userId, pushToken) => {    
    try {
      if (!Expo.isExpoPushToken(pushToken)) {
        throw new Error('Invalid Expo push token');
      }

      // Lưu token vào database
      await User.update(
        { push_token: pushToken },
        { where: { id: userId, role: 'ROLE_ADMIN' } }
      );

      // Cập nhật cache
      adminPushTokens.set(userId, pushToken);

      return true;
    } catch (error) {
      console.error('Error saving push token:', error);
      throw error;
    }
  },

  // Xóa push token của một admin user
  removeAdminPushToken: async (userId) => {
    try {
      await User.update(
        { push_token: null },
        { where: { id: userId, role: 'ROLE_ADMIN' } }
      );

      adminPushTokens.delete(userId);
      return true;
    } catch (error) {
      console.error('Error removing push token:', error);
      throw error;
    }
  },

  // Load tất cả push tokens của admin users từ database
  loadAdminPushTokens: async () => {
    try {
      const adminUsers = await User.findAll({
        where: {
          role: 'ROLE_ADMIN',
          push_token: {
            [Op.not]: null
          }
        }
      });

      adminPushTokens.clear();
      adminUsers.forEach(user => {
        if (user.push_token) {
          adminPushTokens.set(user.id, user.push_token);
        }
      });

      return true;
    } catch (error) {
      console.error('Error loading admin push tokens:', error);
      throw error;
    }
  },

  // Gửi thông báo cho tất cả admin users
  sendNotificationToAdmins: async (title = 'test title', body = 'body test', data = {f: "a"}) => {
    try {
      // Tạo messages cho tất cả admin tokens
      const messages = [];
      for (const [userId, pushToken] of adminPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Invalid Expo push token ${pushToken}`);
          continue;
        }

        messages.push({
          to: pushToken,
          sound: 'default',
          title,
          body,
          data: { ...data, userId },
          badge: 1,
          priority: 'high',
        });
      }

      // Chia thành chunks và gửi
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending chunk:', error);
        }
      }

      return tickets;
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  },

  // Kiểm tra trạng thái của các notification tickets
  checkNotificationStatus: async (tickets) => {
    try {
      const receiptIds = [];
      for (const ticket of tickets) {
        if (ticket.id) {
          receiptIds.push(ticket.id);
        }
      }

      const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
      const receipts = [];

      for (const chunk of receiptIdChunks) {
        try {
          const receipt = await expo.getPushNotificationReceiptsAsync(chunk);
          receipts.push(receipt);
        } catch (error) {
          console.error('Error checking receipts:', error);
        }
      }

      return receipts;
    } catch (error) {
      console.error('Error checking notification status:', error);
      throw error;
    }
  },

  // Hàm test gửi notification
  sendTestNotification: async () => {
    try {
      const result = await NotificationService.sendNotificationToAdmins(
        'Test Notification',
        'This is a test notification',
        { type: 'TEST' }
      );
      return result;
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }
};

module.exports = NotificationService; 