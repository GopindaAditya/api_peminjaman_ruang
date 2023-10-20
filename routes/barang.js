var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const {Barang, Ruangan} = require('../models');


router.get("/", async (req, res, next)=> {
    const barang = await Barang.findAll();
    return res.json({status:200, message:"Suscces get all data", data:barang})
});

router.get('/:id', async (req, res, next) => {
    const ruanganId = req.params.id;
    const barang =await Barang.findAll({
        where:{id_ruangan:ruanganId}
    })
    if (barang.length === 0) {
        return res.status(404).json({status:404, message:"Barang not found"})
    }

    return res.json({
        status:200,
        message:"get data success",
        data:barang
    })
});

router.post('/:id', async(req, res, next)=>{
    const ruanganId = req.params.id;
    const schema = {
        nama_barang:"string"
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(404).json(validate)
    }

    req.body.id_ruangan = ruanganId;
    const barang = await Barang.create(req.body);
    return res.json({
        status:200,
        message:"Success create new data",
        data:barang
    });
});

router.delete('/:id', async(req, res, next)=>{
    const id = req.params.id;
    let barang = await Barang.findByPk(id);
    if (!barang) {
        res.status(404).json({status:404, message:"Data not found"});
    }
    
    await barang.destroy();
    res.json({
        status:200, 
        message:"Success delete data"
    });
});


module.exports = router;