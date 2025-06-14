require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var ruanganRouter = require('./routes/ruangan');
var barangRouter = require('./routes/barang');
var jamRouter = require('./routes/jam');
var peminjamanRouter = require('./routes/peminjaman');
var authRouter = require('./routes/users'); // Add this line

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/ruangan', ruanganRouter);
app.use('/barang', barangRouter);
app.use('/jam', jamRouter)
app.use('/peminjaman', peminjamanRouter);
app.use('/auth', authRouter); // Add this line

module.exports = app;
