const { DataTypes } = require("sequelize");

module.exports = (DataTypes, DataTypes) => {
    const Ruangan = sequelize.define(
        "Ruangan", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nama_ruangan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kapasitas: {
            type: DataTypes.INTEGER
        },
        desc: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
    },{
        tableName: "ruangan"
    }
    );
    Ruangan.hasMany(sequelize.models.Barang, {
        foreignKey: 'id_ruangan'
    });
    Ruangan.hasMany(sequelize.models.Jam, {
        foreignKey: 'id_ruangan'
    });

    return Ruangan; 
}