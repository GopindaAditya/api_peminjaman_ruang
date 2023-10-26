var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const { Ruangan, Peminjaman, Jam, User, Sequelize } = require('../models');

router.post('/:id', async (req, res, next) => {
    const { tanggal, jam_peminjaman, jam_selesai_peminjaman } = req.body;
    const ruanganId = req.params.id;
    req.body.id_ruangan = ruanganId;
    try {
        const peminjaman = await Peminjaman.create(req.body)

        await Jam.update(
            { status_ruangan: '1' }, // Mengubah status menjadi '1' (sudah dipesan)
            {
                where: {
                    tanggal,
                    jam: {
                        [Sequelize.Op.between]: [jam_peminjaman, jam_selesai_peminjaman]
                    },
                    id_ruangan: ruanganId
                }
            }
        );

        res.json({
            status: 200,
            message: "Success add data",
            data: peminjaman
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Eror");
    }
});


router.put('/:id', async (req, res, next) => {
    const peminjamanId = req.params.id;
    const action = req.body;

    try {
        const peminjaman = await Peminjaman.findByPk(peminjamanId);

        if (!peminjaman) {
            return res.status(404).json("Data not found");
        }

        if (action === 'terima') {
            await peminjaman.update({
                status_peminjaman: '1'
            })
        } else {
            await peminjaman.update({
                status_peminjaman: '-1'
            })

            const { tanggal, jam_peminjaman, jam_selesai_peminjaman, id_ruangan } = peminjaman;
            Jam.update(
                { status_ruangan: '0' },
                {
                    where: {
                        tanggal,
                        jam: {
                            [Sequelize.Op.between]: [jam_peminjaman, jam_selesai_peminjaman]
                        },
                        id_ruangan: id_ruangan
                    }
                }
            )
        }
        res.json({
            status: 200,
            message: "Update Status Success"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json("error")
    }
});

router.get('/cari', async (req, res) => {
    const { tanggal, jam } = req.query;
    
    try {
        // Jika jam tidak disertakan, cari ruangan yang tersedia sepanjang hari
        const jadwalQuery = jam ? { jam: { [Sequelize.Op.lte]: jam } } : {};

        // Temukan semua ruangan yang tersedia pada tanggal dan jam yang ditentukan
        const ruanganTersedia = await Jam.findAll({
            where: {
                tanggal,
                status_ruangan: '0', // Status ruangan harus '0' (tersedia)
                ...jadwalQuery,
            },
            attributes: ['id_ruangan'], // Hanya ambil ID ruangan yang tersedia
            raw: true, // Mengembalikan hasil dalam bentuk objek biasa, bukan instance Sequelize
        });

        // Ambil ID ruangan yang tersedia dari hasil pencarian
        const ruanganTersediaIds = ruanganTersedia.map((ruangan) => ruangan.id_ruangan);

        // Temukan informasi lengkap tentang ruangan-ruangan yang tersedia
        const ruanganInfo = await Ruangan.findAll({
            where: {
                id: ruanganTersediaIds,
            },
        });

        res.json({ ruanganTersedia: ruanganInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari ruangan yang tersedia.' });
    }
});




module.exports = router;