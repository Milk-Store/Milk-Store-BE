'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('posts', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: 'title' // nếu DB hỗ trợ, thêm sau cột title
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('posts', 'slug');
  }
}; 