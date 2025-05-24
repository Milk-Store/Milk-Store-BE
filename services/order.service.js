const { Order, OrderItem, Product } = require('../models');
const { PAGINATION } = require('../constants/pagination');
const { where, Op } = require('sequelize');

const getAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return orders;
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw error;
  }
};

const createOrder = async ({phone, name, items, total}) => {
  console.log(phone, name, items, total);
  const order = await Order.create({phone, name, total});
  
  const orderItemsWithOrderId = items.map(item => ({ ...item, order_id: order.id }));
  
  const response = await OrderItem.bulkCreate(orderItemsWithOrderId);
  
  // Trả về đơn hàng với các orderItems
  const createdOrder = await Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'orderItems' }]
  });
  
  return createdOrder;
};

const updateOrder = async ({id, status}) => {
  
  try {
    const currentOrder = await Order.findByPk(id);
    if (!currentOrder) throw new Error('Order not found');
    
    currentOrder.status = status;
    const response = await currentOrder.save();
    
  // Trả về đơn hàng đã cập nhật với các orderItems
  const updatedOrder = await Order.findByPk(id, {
    include: [{ model: OrderItem, as: 'orderItems' }]
  });
  
  return updatedOrder;
  } catch (error) {
    console.error("Error in updateOrder:", error);
    throw error;
  }
};

const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  
  // Xóa các orderItems trước
  await OrderItem.destroy({ where: { order_id: id } });
  
  // Sau đó xóa đơn hàng
  return await order.destroy();
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
}; 