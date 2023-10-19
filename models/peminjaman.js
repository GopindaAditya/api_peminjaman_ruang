require("sequelize");

module.exports = (sequelize, DataTypes) =>{
    const Peminjaman = sequelize.define('Peminjaman', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
          },
          id_peminjam:{
            type:DataTypes.INTEGER,
            allowNull:false
          },
          id_ruangan:{
            type:DataTypes.INTEGER
          },
          jam_peminjaman:{
            type:DataTypes.DATE,
            allowNull:false
          },
          jam_selesai_peminjaman:{
            type:DataTypes.DATE
          },
          status_peminjaman:{
            type:DataTypes.ENUM('0','1','-1')
          },
          createdAt:{
            type:DataTypes.DATE,
            allowNull:false
          },
          updatedAt:{
            type:DataTypes.DATE,
            allowNull:false
          },
    },{
        tableName:'peminjaman'
    })

    return Peminjaman;
}