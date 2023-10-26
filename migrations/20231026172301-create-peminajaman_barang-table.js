'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('peminjaman_barang', { 
      id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
      },
      id_peminjaman_ruangan:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      barang:{
        type: Sequelize.STRING
      },
      jumlah:{
        type: Sequelize.INTEGER
      },
      status:{
        type:Sequelize.ENUM('0', '1', '-1')
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
    await queryInterface.addConstraint('peminjaman_barang', {
      fields: ['id_peminajaman_ruangan'],
      type: 'foreign key',
      references: {
        table: 'peminjaman',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('peminjaman_barang');
    
  }
};
