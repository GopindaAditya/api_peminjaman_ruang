const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Barang = sequelize.define("Barang", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nama_barang: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_ruangan: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
    {
      tableName: "barang"
    });

  Barang.belongsTo(Ruangan, { foreignKey: 'id_ruangan' });

  return Barang;
}