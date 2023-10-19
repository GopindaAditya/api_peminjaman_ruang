var express = require('express');
var router = express.Router();

router.get("/", function (req, res, next) {
    res.send("Hallo world");
});

router.get("/env", function (req, res, next) {
    res.send(process.env.APP_NAME);
});




module.exports = router;