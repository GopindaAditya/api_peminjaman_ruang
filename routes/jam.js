var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const {Jam, Ruangan} = require('../models');

router.get('/', async(req, res, next)=>{
    const jam = Jam.findAll();
    return res.json({
        status:200,
        message:"get all data success",
        data: jam
    });
});

router.get('/:id', async(req, res, next)=>{
    const ruanganId = req.params.id;
    const jam = await Jam.findAll({
        where:{id_ruangan:ruanganId}
    })
    if (jam.length === 0) {
        return res.status(404).json({status:404, message:"data not found"});
    }

    return res.json({
        status:200,
        message:"get data by id_ruangan success",
        data:jam
    });
});

router.post('/:id', async(req, res, next)=>{
    const ruanganId = req.params.id;
  
    req.body.id_ruangan = ruanganId;
    const jam = await Jam.create(req.body);
    return res.json({
        status:200,
        message:"create data success",
        data:jam
    });
});
module.exports = router