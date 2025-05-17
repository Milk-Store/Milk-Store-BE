'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with OrderItem (one-to-many)
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'orderItems'
      });
    }
  }
  Order.init({
    phone: DataTypes.STRING,
    status: DataTypes.ENUM('pending', 'processing', 'completed', 'cancel'),
    total: DataTypes.DECIMAL(10, 0),
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};