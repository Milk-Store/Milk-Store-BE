'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancel'),
      allowNull: false,
      defaultValue: 'pending'
    });

    await queryInterface.addColumn('Orders', 'total', {
      type: Sequelize.DECIMAL(10, 0),
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'status');
    await queryInterface.removeColumn('Orders', 'total');
  }
};
