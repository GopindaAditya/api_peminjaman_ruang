'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('jam', {
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      },
      id_ruangan:{
        type:Sequelize.INTEGER
      },
      tanggal:{
        type:Sequelize.DATEONLY
      },
      jam:{
        type:Sequelize.TIME,
      },
      status_ruangan:{
        type:Sequelize.ENUM('0','1')
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
     await queryInterface.addConstraint('jam', {
      fields: ['id_ruangan'],
      type: 'foreign key',
      references: {
        table: 'ruangan',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('jam');
     
  }
};
