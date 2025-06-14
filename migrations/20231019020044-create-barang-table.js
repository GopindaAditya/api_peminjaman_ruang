'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('barang',
      {
        id: {
          type:Sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          allowNull:false
        },
        nama_barang:{
          type: Sequelize.STRING,
          allowNull:false
        }, 
        id_ruangan:{
          type:Sequelize.INTEGER,
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
      await queryInterface.addConstraint('barang', {
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

  async down(queryInterface, Sequelize) {
     await queryInterface.dropTable('barang');
  }
};
