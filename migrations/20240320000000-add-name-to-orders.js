'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'phone'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'name');
  }
}; 