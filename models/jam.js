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
        jam: {
            type: DataTypes.TIME,
        },
        id_ruangan: {
            type: DataTypes.INTEGER
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