var express = require("express");
require("dotenv").config();
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
const v = new Validator();
const { Users, Sequelize } = require("../models");
const authenticateToken = require("../middleware/authMiddleware");
const { route } = require("./users");

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
