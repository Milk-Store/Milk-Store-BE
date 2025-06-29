'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Posts', 'content', {
      type: 'LONGTEXT',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Posts', 'content', {
      type: 'TEXT',
      allowNull: false,
    });
  },
}; 