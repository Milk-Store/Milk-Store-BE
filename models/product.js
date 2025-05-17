'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with OrderItem (one-to-many)
      Product.hasMany(models.OrderItem, {
        foreignKey: 'product_id',
        as: 'orderItems'
      });
      
      // Define association with Category (many-to-one)
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    category_id: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};