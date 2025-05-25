const { Order, OrderItem, Product } = require('../models');
const { Op, fn, col } = require('sequelize');
const sequelize = require('sequelize');

const getDashboardOverview = async ({ fromDate, toDate, year } = {}) => {
  try {
    let dateFilter = {};

    // ✅ Nếu có truyền year → dùng year
    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31T23:59:59`);
      dateFilter = { createdAt: { [Op.between]: [start, end] } };
    }

    // ✅ Nếu có truyền fromDate và toDate → dùng khoảng thời gian đó
    else if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { [Op.between]: [start, end] } };
    }

    // ✅ Mặc định: từ đầu đến cuối tháng hiện tại
    else {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // cuối tháng
      dateFilter = { createdAt: { [Op.between]: [start, end] } };
    }

    const totalRevenue = await Order.sum("total", {
      where: {
        status: "completed",
        ...dateFilter,
      },
    });

    const totalOrders = await Order.count({
      where: {
        ...dateFilter,
      },
    });

    const totalProducts = await Product.count();

    const pendingOrders = await Order.count({
      where: {
        status: "pending",
        ...dateFilter,
      },
    });

    return {
      totalRevenue: totalRevenue || 0,
      totalOrders,
      totalProducts,
      pendingOrders,
    };
  } catch (error) {
    throw error;
  }
};

const getOrderStatistics = async ({ fromDate, toDate, year } = {}) => {
  try {
    let startDate, endDate;

    const now = new Date();

    if (year) {
      // Thống kê theo cả năm
      startDate = new Date(`${year}-01-01`);
      endDate = new Date(`${year}-12-31T23:59:59`);
    } else if (fromDate && toDate) {
      // Theo khoảng ngày cụ thể
      startDate = new Date(fromDate);
      endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Mặc định: từ đầu đến cuối tháng hiện tại
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const dailyOrders = await Order.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('total')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']]
    });

    const labels = dailyOrders.map(order => order.getDataValue('date'));
    const orderCounts = dailyOrders.map(order => parseInt(order.getDataValue('count')));
    const revenues = dailyOrders.map(order => parseFloat(order.getDataValue('revenue') || 0));

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

const getOrderStatusStatistics = async ({ fromDate, toDate, year } = {}) => {
  try {
    let startDate, endDate;
    const now = new Date();

    if (year) {
      startDate = new Date(`${year}-01-01`);
      endDate = new Date(`${year}-12-31T23:59:59`);
    } else if (fromDate && toDate) {
      startDate = new Date(fromDate);
      endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Mặc định: tháng hiện tại
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const statusCounts = await Order.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['status']
    });

    const labels = statusCounts.map(item => item.status);
    const data = statusCounts.map(item => parseInt(item.getDataValue('count')));

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgb(255, 99, 132)',   // pending
          'rgb(54, 162, 235)',   // processing
          'rgb(255, 205, 86)',   // completed
          'rgb(75, 192, 192)'    // cancelled, etc.
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
