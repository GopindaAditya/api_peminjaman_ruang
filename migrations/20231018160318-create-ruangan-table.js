'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('ruangan', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      },
      nama_ruangan:{
        type: Sequelize.STRING,
        allowNull:false
      }, 
      kapasitas:{
        type:Sequelize.INTEGER
      },
      desc:{
        type:Sequelize.STRING
      },
      status_ruangan:{
        type:Sequelize.ENUM("aktif", "nonaktif")        
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
    await queryInterface.dropTable('ruangan');
  }
};
