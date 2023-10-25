require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Jam = sequelize.define(
        'Jam', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_ruangan: {
            type: DataTypes.INTEGER
        },
        tanggal:{
            type: DataTypes.DATEONLY
        },
        jam: {
            type: DataTypes.TIME,
        },
        status_ruangan:{
            type: DataTypes.ENUM('0','1'),
            defaultValue: '0'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        tableName: "jam"
    });
    // Jam.belongsTo(Ruangan, { foreignKey: 'id_ruangan' });  

    return Jam;
}