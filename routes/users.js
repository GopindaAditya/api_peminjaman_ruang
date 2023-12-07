var express = require("express");
require("dotenv").config();
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
const v = new Validator();
const { Users, sequelize } = require("../models");
const authenticateToken = require("../middleware/authMiddleware");
const { route } = require("./peminjaman");
const { where } = require("sequelize");

router.post("/register/user", async (req, res) => {
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

router.post("/register/sekretariat", async (req, res) => {
  const schema = {
    name: "string",
    password: "string",
  };

  const validete = v.validate(req.body, schema);
  if (validete.lenght) {
    res.status(400).json(validete);
  }

  req.body.role = "sekretariat";
  req.body.telepon = "08112661144";
  const user = await Users.create(req.body);
  res.json({
    status: 200,
    message: "Success create data ",
    data: user,
  });
});

router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.id;

    const schema = {
      name: "string|optional",
      nim: "number|optional",
      telepon: "string|optional",
    };

    const validate = v.validate(req.body, schema);
    if (validate.lenght) {
      res.status(400).json(validate);
    }
    const user = await Users.update(req.body, { where: { id: userId } });
    res.json({
      statsu: 200,
      message: "success update data",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.get('/sekretariat', async (req,res)=>{
  const user = await Users.findAll({
    where : {role: "sekretariat"}
  });
  if (!user) {
    es.status(404).json("Data Not Found");
  }
  res.json({
    statsu: 200,
    message: "success get data",
    data: user,
  });
});

router.get('/sekretariat/:id', async (req,res)=>{
  const user = await Users.findByPk(req.params.id);
  if (!user) {
    es.status(404).json("Data Not Found");
  }
  res.json({
    statsu: 200,
    message: "success get data",
    data: user,
  });
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

    res.cookie("jwt", token, { httpOnly: true });
    res.json({ token, user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  let user = await Users.findByPk(userId);
  if (!user) {
    return res.status(404).json({ status: 404, message: "Data not found" });
  }

  await user.destroy();
  res.json({
    status: 200,
    message: "Delete Data Success",
  });
});

router.post("/logout", authenticateToken, (req, res) => {
  // Assuming you're using tokens stored in cookies
  res.clearCookie("jwt"); // Clear the JWT cookie on the client

  // You might also want to keep track of invalidated tokens on the server
  // and add logic to block access for tokens that are marked as invalidated.

  res.json({ message: "Logout successful" });
});

router.get("/profile", authenticateToken, async (req, res) => {
  const user = await Users.findByPk(req.user.id);

  res.json({ user });
});

module.exports = router;
