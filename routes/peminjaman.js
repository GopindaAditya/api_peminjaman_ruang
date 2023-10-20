var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const {Ruangan} = require('../models');

