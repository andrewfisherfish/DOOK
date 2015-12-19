var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug');
var fs = require('fs');

var menu = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/menu.json'), 'utf8'));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('book', {title: 'Express', menuObj: menu});
});

module.exports = router;