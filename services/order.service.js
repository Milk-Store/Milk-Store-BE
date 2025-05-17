const { Order, OrderItem, Product } = require('../models');
const { PAGINATION } = require('../constants/pagination');
const { where, Op } = require('sequelize');

const getAllOrders = async (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, filters = {}) => {
  try {
    const offset = (page - 1) * limit;
    
    // Build where clause based on filters
    const whereClause = {};
    
    // Filter by status if provided
    if (filters.status) {
      whereClause.status = filters.status;
    }
    
    // Filter by date range if provided
    if (filters.startDate && filters.endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
      };
    }
    
    // Determine sort order
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
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
      order: [['createdAt', sortOrder]],
      limit,
      offset
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      itemsPerPage: limit,
      orders: rows
    };
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw error;
  }
};


const createOrder = async ({phone, items, total}) => {
  
  const order = await Order.create({phone});
  
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