const { Expo } = require('expo-server-sdk');
const { User } = require('../models');
const { Op } = require('sequelize');
const expo = new Expo();

const sendPushNotification = async (message) => {
  try {
    // Validate message format
    if (!message || !message.title || !message.body) {
      console.error('Invalid message format:', message);
      return;
    }

    // Lấy tất cả admin users có push_token
    const adminUsers = await User.findAll({
      where: {
        role: 'ROLE_ADMIN',
        push_token: {
          [Op.not]: null
        }
      },
      attributes: ['id', 'email', 'push_token'] // Chỉ lấy các trường cần thiết
    });

    if (!adminUsers.length) {
      console.log('No admin users with push tokens found');
      return;
    }

    const notifications = [];
    const invalidTokens = [];

    // Validate và chuẩn bị notifications
    for (const admin of adminUsers) {
      const pushToken = admin.push_token;
      
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Invalid Expo push token for admin ${admin.email}`);
        invalidTokens.push({ userId: admin.id, token: pushToken });
        continue;
      }

      notifications.push({
        to: pushToken,
        sound: 'default',
        title: message.title,
        body: message.body,
        data: message.data || {},
        priority: 'high',
        channelId: 'default', // Android channel ID
      });
    }

    // Xóa các token không hợp lệ
    if (invalidTokens.length > 0) {
      await User.update(
        { push_token: null },
        {
          where: {
            id: { [Op.in]: invalidTokens.map(item => item.userId) }
          }
        }
      );
    }

    // Nếu không có notifications hợp lệ, thoát
    if (!notifications.length) {
      console.log('No valid notifications to send');
      return;
    }

    // Gửi notifications theo chunks để tránh quá tải
    const chunks = expo.chunkPushNotifications(notifications);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log('Push notifications sent successfully:', ticketChunk.length);
      } catch (error) {
        console.error('Error sending push notifications:', error);
        // Tiếp tục với chunk tiếp theo nếu có lỗi
      }
    }

    // Xử lý response tickets
    for (const ticket of tickets) {
      if (ticket.status === 'error') {
        console.error(`Error ticket:`, ticket);
        if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
          // Tìm và xóa token không hợp lệ
          const invalidToken = notifications.find(n => n.to === ticket.to);
          if (invalidToken) {
            await User.update(
              { push_token: null },
              {
                where: {
                  push_token: invalidToken.to
                }
              }
            );
          }
        }
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    // Không throw error để không ảnh hưởng đến business logic chính
  }
};

const sendNewOrderNotification = async (order) => {
  try {
    if (!order || !order.phone || !order.total) {
      console.error('Invalid order data:', order);
      return;
    }

    const message = {
      title: 'Đơn hàng mới!',
      body: `Có đơn hàng mới từ ${order.phone} với tổng giá trị ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}`,
      data: {
        type: 'NEW_ORDER',
        orderId: order.id,
        createdAt: order.createdAt,
      },
    };

    return await sendPushNotification(message);
  } catch (error) {
    console.error('Error in sendNewOrderNotification:', error);
    // Không throw error để không ảnh hưởng đến business logic chính
  }
};

module.exports = {
  sendPushNotification,
  sendNewOrderNotification,
}; 