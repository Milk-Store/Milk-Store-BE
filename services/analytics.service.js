const { Order, OrderItem, Product } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const getDashboardOverview = async () => {
  try {
    // Tổng doanh thu từ đơn hàng completed
    const totalRevenue = await Order.sum('total', {
      where: { status: 'completed' }
    });

    // Tổng số đơn hàng
    const totalOrders = await Order.count();

    // Tổng số sản phẩm
    const totalProducts = await Product.count();

    // Số đơn hàng đang chờ xử lý
    const pendingOrders = await Order.count({
      where: { status: 'pending' }
    });

    return {
      totalRevenue: totalRevenue || 0,
      totalOrders,
      totalProducts,
      pendingOrders
    };
  } catch (error) {
    throw error;
  }
};

const getOrderStatistics = async (period = '7days') => {
  try {
    let startDate;
    const endDate = new Date();

    // Xác định khoảng thời gian
    switch (period) {
      case '7days':
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'currentMonth':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
    }

    // Lấy dữ liệu đơn hàng theo ngày
    const dailyOrders = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Format dữ liệu cho Chart.js
    const labels = dailyOrders.map(order => order.getDataValue('date'));
    const orderCounts = dailyOrders.map(order => order.getDataValue('count'));
    const revenues = dailyOrders.map(order => order.getDataValue('revenue') || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Số đơn hàng',
          data: orderCounts,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Doanh thu',
          data: revenues,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    };
  } catch (error) {
    throw error;
  }
};

const getOrderStatusStatistics = async () => {
  try {
    const statusCounts = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Format dữ liệu cho Chart.js
    const labels = statusCounts.map(item => item.status);
    const data = statusCounts.map(item => item.getDataValue('count'));

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)'
        ]
      }]
    };
  } catch (error) {
    throw error;
  }
};

const getTopSellingProducts = async (limit = 5) => {
  try {
    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'total_revenue']
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'image']
      }],
      group: ['product_id'],
      order: [[sequelize.literal('total_quantity'), 'DESC']],
      limit
    });

    return topProducts.map(item => ({
      productId: item.product_id,
      name: item.product.name,
      image: item.product.image,
      totalQuantity: item.getDataValue('total_quantity'),
      totalRevenue: item.getDataValue('total_revenue')
    }));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardOverview,
  getOrderStatistics,
  getOrderStatusStatistics,
  getTopSellingProducts
};
