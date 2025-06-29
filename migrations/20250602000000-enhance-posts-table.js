"use strict";
const { POST_STATUS } = require('../constants/posts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("posts", "excerpt", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("posts", "status", {
      type: Sequelize.ENUM(Object.values(POST_STATUS)),
      allowNull: false,
      defaultValue: POST_STATUS.DRAFT,
    });

    await queryInterface.addColumn("posts", "publishedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("posts", "metaTitle", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("posts", "metaDescription", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("posts", "featured", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("posts", "viewCount", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("posts", "excerpt");
    await queryInterface.removeColumn("posts", "status");
    await queryInterface.removeColumn("posts", "publishedAt");
    await queryInterface.removeColumn("posts", "metaTitle");
    await queryInterface.removeColumn("posts", "metaDescription");
    await queryInterface.removeColumn("posts", "featured");
    await queryInterface.removeColumn("posts", "viewCount");
  },
}; 