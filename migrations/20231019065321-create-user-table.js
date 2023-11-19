// migrations/YYYYMMDDHHmmss-create-users.js

'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      nim: {
        type: Sequelize.STRING,
      },
      telepon: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM('peminjam', 'admin', 'sekretariat'),
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Insert a default admin user
    const password = await bcrypt.hash('adminpassword', 10);
    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      nim: 'admin',
      telepon: 'adminphone',
      role: 'admin',
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
