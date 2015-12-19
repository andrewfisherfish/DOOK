var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug');
var fs = require('fs');

router.get('/test', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        id: 0,
        testing: 'some string'
    }));
});

router.get('/loremIpsum', function (req, res, next) {
    var loremIpsum = fs.readFileSync(path.join(__dirname, '../public/lorem-ipsum.txt'), 'utf8');
    res.send(loremIpsum);
});

module.exports = router;
