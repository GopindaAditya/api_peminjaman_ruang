const peminjaman = require("./peminjaman");

require("sequelize");

module.exports=(sequelize, DataTypes)=>{
    const Users = sequelize.define('Users',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
          }, 
          name:{
            type:DataTypes.STRING,
          },
          nim:{
            type:DataTypes.STRING
          },
          telepon:{
            type:DataTypes.STRING
          },
          role:{
            type:DataTypes.ENUM('peminjam','admin', 'sekretariat' )
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
        tableName:'users'
    });

    Users.belongsToMany(Ruangan, {
        through: peminjaman,
        foreignKey: 'id_peminjam',
      });
    
    return Users;
}