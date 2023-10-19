'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('peminjaman', {
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      },
      id_peminjam:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      id_ruangan:{
        type:Sequelize.INTEGER
      },
      jam_peminjaman:{
        type:Sequelize.DATE,
        allowNull:false
      },
      jam_selesai_peminjaman:{
        type:Sequelize.DATE
      },
      status_peminjaman:{
        type:Sequelize.ENUM('0','1','-1')
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
    await queryInterface.addConstraint('peminjaman', {
      fields: ['id_peminjam'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('peminjaman', {
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
    await queryInterface.dropTable('peminjaman');
     
  }
};
