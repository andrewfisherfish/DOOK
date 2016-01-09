var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug');
var fs = require('fs');

var menu = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/menu.json'), 'utf8'));

var loremIpsum = fs.readFileSync(path.join(__dirname, '../public/lorem-ipsum.txt'), 'utf8');

router.get('/', function (req, res, next) {
    res.render('index', {});
});

router.get('/products', function (req, res, next) {
    res.render('products', {});
});

router.get('/product', function (req, res, next) {
    res.render('product', {});
});

router.get('/authors', function (req, res, next) {
    res.render('authors', {});
});

router.get('/about', function (req, res, next) {
    res.render('about', {});
});

router.get('/account', function (req, res, next) {
    res.render('account', {});
});

module.exports = router;