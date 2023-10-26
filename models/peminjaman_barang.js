require("sequelize")

module.exports = (sequlize, DataTypes) => {
    const PeminjamanBarang = sequlize.define('Peminjaman_barang', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_peminjaman_ruangan: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        barang: {
            type: DataTypes.STRING
        },
        jumlah: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.ENUM('0', '1', '-1'),
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
    },{
        tableName : 'peminjaman_barang'
    });

    return PeminjamanBarang;
}