'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'Sữa tươi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sữa chua',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bơ và phô mai',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kem',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
