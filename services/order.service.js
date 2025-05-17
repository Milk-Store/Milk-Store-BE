const { Order, OrderItem, Product } = require('../models');
const { PAGINATION } = require('../constants/pagination');
const { where } = require('sequelize');

const getAllOrders = async (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) => {
  try {
    console.log("get all orders service");
    console.log("page", page);
    console.log("limit", limit);
  
    const offset = (page - 1) * limit;
    console.log("offset", offset);
  
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
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    console.log("orders service", orders.length); // <- In ra số lượng đơn hàng

    return orders;
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw error;
  }
};


const createOrder = async ({phone, items, total}) => {
  console.log("orderData", {phone, items, total});
  
  const order = await Order.create({phone});
  console.log("order", order);
  
  const orderItemsWithOrderId = items.map(item => ({ ...item, order_id: order.id }));
  console.log("orderItemsWithOrderId", orderItemsWithOrderId);
  
  const response = await OrderItem.bulkCreate(orderItemsWithOrderId);
  console.log("response", response);
  
  // Trả về đơn hàng với các orderItems
  const createdOrder = await Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'orderItems' }]
  });
  
  return createdOrder;
};

const updateOrder = async ({id, status}) => {
  console.log("update order", id);
  console.log("update order data11111", status);
  
  try {
    const currentOrder = await Order.findByPk(id);
    console.log("currentOrder", currentOrder);
    if (!currentOrder) throw new Error('Order not found');
    
console.log("Current order status:", currentOrder.status);

    currentOrder.status = status;
    const response = await currentOrder.save();
    console.log("response", response);
    
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