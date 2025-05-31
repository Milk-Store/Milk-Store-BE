'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('products', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // mặc định không phải là sản phẩm bán chạy
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('products', 'status');
  }
};
