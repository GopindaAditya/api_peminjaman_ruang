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
          tanggal:{
            type:DataTypes.DATEONLY
          },
          jam_peminjaman:{
            type:DataTypes.TIME,
            allowNull:false
          },
          jam_selesai_peminjaman:{
            type:DataTypes.TIME
          },
          status_peminjaman:{
            type:DataTypes.ENUM('0','1','-1'),
            defaultValue: '0'
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