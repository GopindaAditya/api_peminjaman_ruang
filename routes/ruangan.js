var express = require('express');
const moment = require('moment');
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const {Ruangan, Jam} = require('../models');


//get data
router.get("/", async (req, res, next)=> {
    const ruangan = await Ruangan.findAll();
    return res.json({status:200, message:"Suscces get all data", data:ruangan})
});
 
//get data by id
router.get("/:id", async(req, res, next)=>{
    const id = req.params.id;
    let ruangan = await Ruangan.findByPk(id);
    if (!ruangan) {
        return res.status(404).json({status:404, message:"Data Not Found"});
    }else{
        // const jam = await Jam.findAll({
        //     where: {
        //         id_ruangan: id                
        //      } 
        // })

        return res.json({
            status:200,
            message:"Succes get Data",
            data:ruangan
        });
    }
})



//create data
router.post('/', async (req, res, next) => {
    const schema = {
      nama_ruangan: 'string',
      kapasitas: 'string',
      desc: 'string'
    };
  
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
  
    const ruangan = await Ruangan.create(req.body);
  
    // Setelah ruangan berhasil dibuat, lakukan generasi jadwal
    await generateJadwal(ruangan.id);
  
    res.json({
      status: 200,
      message: 'Success create data and generate jadwal',
      data: ruangan,
    });
  });
  
  // Fungsi untuk generasi jadwal
  async function generateJadwal(idRuangan) {
    const startDate = moment().startOf('month');
    const endDate = moment().endOf('month');
    const jamAwal = moment('07:00', 'HH:mm');
    const jamAkhir = moment('21:00', 'HH:mm');
  
    const jadwals = [];
  
    for (let currentDate = startDate.clone(); currentDate.isSameOrBefore(endDate); currentDate.add(1, 'day')) {
      for (let currentJam = jamAwal.clone(); currentJam.isSameOrBefore(jamAkhir); currentJam.add(1, 'hour')) {
        const jadwal = {
          id_ruangan: idRuangan,
          tanggal: currentDate.format('YYYY-MM-DD'),
          jam: currentJam.format('HH:mm'),
          status_ruangan: '0', // Sesuaikan status sesuai kebutuhan Anda
        };
        jadwals.push(jadwal);
      }
    }
  
    // Simpan jadwal ke dalam database
    await Jam.bulkCreate(jadwals);
  }
  

//update data
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    let ruangan = await Ruangan.findByPk(id);
    if (!ruangan) {
        return res.status(404).json({ status: 404, message: "Data Not Found" });
    }
    
    const schema = {
        nama_ruangan: 'string|optional',
        kapasitas: 'number|optional',
        desc: 'string|optional',
    };
    const validate = v.validate(req.body, schema);

    if (validate.error) {
        return res.status(400).json({ status: 400, message: "Invalid data", errors: validate.error });
    }

    // Menambahkan kondisi where untuk menentukan data yang akan diupdate
    const updatedRuangan = await Ruangan.update(req.body, {
        where: { id: id } // Menentukan data yang akan diupdate berdasarkan ID
    });

    res.json({
        status: 200,
        message: "Success update data",
        data: updatedRuangan,
    });
});

//delete data
router.delete('/:id', async(req, res, next)=>{
    const id = req.params.id;
    let ruangan = await Ruangan.findByPk(id);
    if (!ruangan) {
        return res.status(404).json({status:404, message:"Data not found"})
    }

    await ruangan.update({status_ruangan:"nonaktif"});
    res.json({
        status:200,
        message:"Delete Data Success"
    });
});


module.exports = router;