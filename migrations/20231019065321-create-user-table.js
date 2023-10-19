'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      }, 
      name:{
        type:Sequelize.STRING,
      },
      nim:{
        type:Sequelize.STRING
      },
      telepon:{
        type:Sequelize.STRING
      },
      role:{
        type:Sequelize.ENUM('peminjam','admin', 'sekretariat' )
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull:false
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull:false
      },
    });

  },

  async down (queryInterface, Sequelize) {

     await queryInterface.dropTable('users');
    
  }
};
