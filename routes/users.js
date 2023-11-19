var express = require("express");
require("dotenv").config();
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
const v = new Validator();
const { Users } = require("../models");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  const schema = {
    name: "string",
    nim: "number",
    telepon: "string",
    password: "string",
  };

  const validete = v.validate(req.body, schema);
  if (validete.lenght) {
    res.status(400).json(validete);
  }
  const user = await Users.create(req.body);
  res.json({
    status: 200,
    message: "Success create data ",
    data: user,
  });
});

router.put('/edit',authenticateToken,  async(req, res, next)=>{
  try {
    const userId = req.user.id;
    
    const schema = {
      'name':'string',
      'nim':'number',
      'telepon' : "string",      
    };

    const validate = v.validate(req.body, schema);
    if (validate.lenght) {
      res.status(400).json(validate)
    }
    const user = await Users.update(req.body,{where:{ id:userId}});
    res.json({
      statsu:200,
      message:"success update data",
      data:user
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  let user;

  if (!isNaN(identifier)) {
    user = await Users.findOne({ where: { nim: identifier } });
  } else {
    user = await Users.findOne({ where: { name: identifier } });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user.id, nim: user.nim },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  const user = await Users.findByPk(req.user.id);

  res.json({ user });
});

module.exports = router;
