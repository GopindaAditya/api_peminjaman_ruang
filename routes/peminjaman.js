var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");
const v = new Validator();
const {
  Ruangan,
  Peminjaman,
  Jam,
  User,
  Sequelize,
  Peminjaman_barang,
  sequelize,
} = require("../models");

router.get("/", async (req, res, next) => {
  const peminjaman = await Peminjaman.findAll({
    where: { status_peminjaman: "0" },
  });

  return res.json({
    status: 200,
    message: "Get data success",
    data: peminjaman,
  });
});

router.post("/:id", async (req, res, next) => {
  const { tanggal, jam_peminjaman, jam_selesai_peminjaman, barang } = req.body;
  const ruanganId = req.params.id;
  req.body.id_ruangan = ruanganId;

  try {
    // Membuat peminjaman ruangan
    const peminjamanRuangan = await Peminjaman.create(req.body);

    // Menyimpan data peminjaman barang
    const peminjamanBarangPromises = barang.map(async (item) => {
      // Menyimpan data peminjaman barang terkait dengan id_peminjaman_ruangan yang baru saja dibuat
      await Peminjaman_barang.create({
        id_peminjaman_ruangan: peminjamanRuangan.id, // Menggunakan ID peminjaman ruangan yang baru saja dibuat
        barang: item.barang,
        jumlah: item.jumlah,
      });
    });

    // Menunggu semua operasi penyimpanan peminjaman barang selesai
    await Promise.all(peminjamanBarangPromises);

    res.json({
      status: 200,
      message: "Success add data",
      data: peminjamanRuangan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error");
  }
});

router.put("/:id", async (req, res, next) => {
  const peminjamanId = req.params.id;
  const action = req.body.status;

  try {
    const peminjaman = await Peminjaman.findByPk(peminjamanId);

    if (!peminjaman) {
      return res.status(404).json("Data not found");
    }
    const { tanggal, jam_peminjaman, jam_selesai_peminjaman, id_ruangan } =
      peminjaman;

    const conflictingReservations = await Peminjaman.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: peminjamanId,
        },
        id_ruangan,
        status_peminjaman: "0",
        [Sequelize.Op.or]: [
          {
            tanggal,
            jam_peminjaman: {
              [Sequelize.Op.between]: [jam_peminjaman, jam_selesai_peminjaman],
            },
          },
          {
            tanggal,
            jam_selesai_peminjaman: {
              [Sequelize.Op.between]: [jam_peminjaman, jam_selesai_peminjaman],
            },
          },
        ],
      },
    });

    if (action == "1") {
      await peminjaman.update({
        status_peminjaman: "1",
      });

      await Peminjaman_barang.update(
        { status: "1" },
        { where: { id_peminjaman_ruangan: peminjamanId } }
      );

      await Jam.update(
        { status_ruangan: "1" },
        {
          where: {
            tanggal,
            jam: {
              [Sequelize.Op.between]: [jam_peminjaman, jam_selesai_peminjaman],
            },
            id_ruangan: id_ruangan,
          },
        }
      );
      const rejectPromises = conflictingReservations.map(
        async (conflictingReservation) => {
          await conflictingReservation.update({
            status_peminjaman: "-1",
          });
          // Update status for Peminjaman_barang
          await Peminjaman_barang.update(
            { status: "-1" },
            { where: { id_peminjaman_ruangan: conflictingReservation.id } }
          );

          // Send rejection message via WhatsApp
          const rejectionMessage = `Pemesanan Ruangan untuk tanggal ${conflictingReservation.tanggal}, jam ${conflictingReservation.jam_peminjaman} - ${conflictingReservation.jam_selesai_peminjaman}, ruangan ID ${id_ruangan}, DITOLAK.`;

          const rejectionData = new FormData();
          rejectionData.append("target", "089638647717");
          rejectionData.append("message", rejectionMessage);
          rejectionData.append(
            "url",
            "https://md.fonnte.com/images/wa-logo.png"
          );
          rejectionData.append("filename", "filename.pdf");
          rejectionData.append("schedule", "0");
          rejectionData.append("delay", "2");
          rejectionData.append("countryCode", "62");

          const rejectionResponse = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            mode: "cors",
            headers: new Headers({
              Authorization: "Ph2GJQCYaeAs7yCy8HTW",
            }),
            body: rejectionData,
          });

          const rejectionJsonResponse = await rejectionResponse.json();
          console.log("Rejection response:", rejectionJsonResponse);
        }
      );

      await Promise.all(rejectPromises);
      const message = `Pemesanan Ruangan sudah diterima untuk tanggal ${tanggal}, jam ${jam_peminjaman} - ${jam_selesai_peminjaman}, ruangan ID ${id_ruangan}.`;

      (async () => {
        const data = new FormData();
        data.append("target", "085738815164");
        data.append("message", message);
        data.append("url", "https://md.fonnte.com/images/wa-logo.png");
        data.append("filename", "filename.pdf");
        data.append("schedule", "0");
        data.append("delay", "2");
        data.append("countryCode", "62");

        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          mode: "cors",
          headers: new Headers({
            Authorization: "Ph2GJQCYaeAs7yCy8HTW",
          }),
          body: data,
        });

        const jsonResponse = await response.json();
        res.json(jsonResponse);
      })();
    } else {
      await peminjaman.update({
        status_peminjaman: "-1",
      });

      await Peminjaman_barang.update(
        { status: "-1" },
        { where: { id_peminjaman_ruangan: peminjamanId } }
      );

      const message = `Pemesanan Ruangan untuk tanggal ${tanggal}, jam ${jam_peminjaman} - ${jam_selesai_peminjaman}, ruangan ID ${id_ruangan}, DITOLAK.`;

      (async () => {
        const data = new FormData();
        data.append("target", "085738815164");
        data.append("message", message);
        data.append("url", "https://md.fonnte.com/images/wa-logo.png");
        data.append("filename", "filename.pdf");
        data.append("schedule", "0");
        data.append("delay", "2");
        data.append("countryCode", "62");

        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          mode: "cors",
          headers: new Headers({
            Authorization: "Ph2GJQCYaeAs7yCy8HTW",
          }),
          body: data,
        });

        const jsonResponse = await response.json();
        res.json(jsonResponse);
      })();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
});

router.get("/cari", async (req, res) => {
  const { tanggal, jam } = req.query;

  try {
    // Jika jam tidak disertakan, cari ruangan yang tersedia sepanjang hari
    // const jadwalQuery = jam ? { jam: { [Sequelize.Op.lte]: jam } } : {};
    const jadwalQuery = jam ? { jam: jam } : {};

    // Temukan semua ruangan yang tersedia pada tanggal dan jam yang ditentukan
    const ruanganTersedia = await Jam.findAll({
      where: {
        tanggal,
        status_ruangan: "0",
        ...jadwalQuery,
      },
      attributes: ["id_ruangan"], // Hanya ambil ID ruangan yang tersedia
      raw: true, // Mengembalikan hasil dalam bentuk objek biasa, bukan instance Sequelize
    });

    // Ambil ID ruangan yang tersedia dari hasil pencarian
    const ruanganTersediaIds = ruanganTersedia.map(
      (ruangan) => ruangan.id_ruangan
    );

    // Temukan informasi lengkap tentang ruangan-ruangan yang tersedia
    const ruanganInfo = await Ruangan.findAll({
      where: {
        id: ruanganTersediaIds,
      },
    });

    // if (!ruanganInfo.length) {
    //     res.status(404).json("data not found")
    // }
    res.json({ ruanganTersedia: ruanganInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mencari ruangan yang tersedia.",
    });
  }
});

module.exports = router;
