var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const {Ruangan} = require('../models');

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
        return res.json({
            status:200,
            message:"Succes get Data",
            data:ruangan
        });
    }

})
//create data
router.post('/', async(req, res, next)=>{
    const schema = {
        nama_ruangan :'string',
        kapasitas:'number',
        desc:'string'
    }

    const validete = v.validate(req.body, schema)
    if (validete.lenght) {
        return res.status(400).json(validete);
    }

    const ruangan = await Ruangan.create(req.body);
    res.json({
        status:200,
        message:"Success create data ",
        data:ruangan,
    });
});

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
        data: ruangan,
    });
});

//delete data
router.delete('/:id', async(req, res, next)=>{
    const id = req.params.id;
    let ruangan = await Ruangan.findByPk(id);
    if (!ruangan) {
        return res.status(404).json({status:404, message:"Data not found"})
    }

    await ruangan.destroy();
    res.json({
        status:200,
        message:"Delete Data Success"
    });
});


module.exports = router;