var express = require('express');
var router = express.Router();

router.get('/test', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        id: 0,
        testing: 'some string'
    }));
});

module.exports = router;
