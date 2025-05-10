'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  RefreshToken.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    is_used: DataTypes.BOOLEAN,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refreshtokens',
    underscored: true,
    timestamps: true
  });
  return RefreshToken;
};