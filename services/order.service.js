const { Order, OrderItem } = require('../models');
const { PAGINATION } = require('../constants/pagination');

const getAllOrders = async (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
  const offset = (page - 1) * limit;
  const orders = await Order.findAll({
    include: [
      { model: OrderItem, as: 'orderItems' },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
  return orders;
};

const createOrder = async (orderData, orderItems) => {
  const order = await Order.create(orderData);
  const orderItemsWithOrderId = orderItems.map(item => ({ ...item, order_id: order.id }));
  await OrderItem.bulkCreate(orderItemsWithOrderId);
  return order;
};

const updateOrder = async (id, orderData) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  
  return await order.update(orderData);
};

const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  
  return await order.destroy();
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
}; 