var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug');
var fs = require('fs');
var _ = require('underscore');

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

var getRandomInt = function (min, max) {
    if (min === max)return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var n = function (n) {
    return n > 9 ? "" + n : "0" + n;
};

var shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function loremIpsumService() {
    var getText = function (msgLength) {
        msgLength = msgLength || 10000;

        var message = fs.readFileSync(path.join(__dirname, '../public/lorem-ipsum.txt'), 'utf8');
        var start = getRandomInt(0, message.length - Math.min(message.length, msgLength));
        return message.substr(start, msgLength).trim();
    };

    var onlyLetters = function (data) {
        return data.replace(/[^a-zA-Z-\s]/g, '');
    };

    _.extend(this, {
        getText: function (min, max) {
            max = max || min;
            var len = getRandomInt(min, max);
            return onlyLetters(getText(len));
        },
        getTitle: function (min, max) {
            max = max || min;
            var len = getRandomInt(min, max);
            return onlyLetters(getText(len));
        },
        getName: function () {
            var data = onlyLetters(getText(30));

            var name = [
                (data.charAt(0).toUpperCase() + data.substring(1, 5).toLowerCase()).replace(/[^a-zA-Z]/g, ''),
                (data.charAt(6).toUpperCase() + data.substring(6, 11).toLowerCase()).replace(/[^a-zA-Z]/g, '')
            ];

            return name.join(' ');
        },
        getAvatar: function () {
            return '/img/avatar_0' + getRandomInt(1, 5) + '.jpg';
        }
    });
}

function fakeDataService() {
    var self = this;
    var loremIpsumServiceInst = new loremIpsumService();

    self.author = function () {
        return {
            src: loremIpsumServiceInst.getAvatar(),
            name: loremIpsumServiceInst.getName()
        }
    };

    self.getAuthors = function (max) {
        var authors = [];
        var length = getRandomInt(1, max || 5);

        for (var i = 1; i <= length; i++) {
            authors.push(self.author());
        }

        return shuffle(authors);
    };

    self.product = function (prodType) {
        var productTypes = ['book', 'lecture'];
        var randomIndex = prodType || getRandomInt(0, 1);
        var productCategories = ['books', 'courses'];

        var product = {
            imgSrc: '/img/products/product-' + n(getRandomInt(1, 17)) + '.jpg',
            title: loremIpsumServiceInst.getText(15),
            productType: productTypes[randomIndex],
            productCategory: productCategories[randomIndex],
            prodAttr: [],
            authors: self.getAuthors(3),
            longDescription: loremIpsumServiceInst.getText(50, 300),
            shortDescription: loremIpsumServiceInst.getText(20, 50),
            price: getRandomInt(50, 200)
        };

        switch (product.productType) {
            case productTypes[0]:
                product.prodAttr.push('Pages: <span>244</span>');
                break;
            case productTypes[1]:
                product.prodAttr.push('Lectures: <span>10 + 2 bonus</span>');
                product.prodAttr.push('Duration: <span>3 month</span>');
                break;
            default:
                break;
        }

        return product;
    };

    self.products = function (params) {
        var products = [];

        for (var i = 1; i <= params.pageLength; i++) {
            products.push(self.product());
        }

        return shuffle(products)
    };

    self.notification = function () {
        var notificationTypes = ['new-book', 'new-lecture', 'internal-alert', 'new-author'];

        var randomIndex = getRandomInt(0, 3);

        var notification = {
            title: loremIpsumServiceInst.getText(15),
            type: notificationTypes[randomIndex]
        };

        switch (notification.type) {
            case notificationTypes[0]:
                notification.authors = self.getAuthors();
                notification.product = self.product(0);
                break;
            case notificationTypes[1]:
                notification.authors = self.getAuthors();
                notification.product = self.product(1);
                break;
            case notificationTypes[2]:
                notification.text = loremIpsumServiceInst.getText(50, 300);
                break;
            case notificationTypes[3]:
                notification.author = self.author();
                break;
            default:
                break;
        }

        return notification;
    };

    self.notifications = function (params) {
        var notifications = [];

        for (var i = 1; i <= params.pageLength; i++) {
            notifications.push(self.notification());
        }

        return shuffle(notifications)
    };

}

router.get('/notifications', function (req, res, next) {
    var fakeDataServiceInst = new fakeDataService();

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(fakeDataServiceInst.notifications(req.query)));
});

router.get('/products', function (req, res, next) {
    var fakeDataServiceInst = new fakeDataService();

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(fakeDataServiceInst.products(req.query)));
});

router.get('/products/recent', function (req, res, next) {
    var fakeDataServiceInst = new fakeDataService();

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(fakeDataServiceInst.products(req.query)));
});

router.get('/products/purchased', function (req, res, next) {
    var fakeDataServiceInst = new fakeDataService();

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(fakeDataServiceInst.products(req.query)));
});

router.get('/products/liked', function (req, res, next) {
    var fakeDataServiceInst = new fakeDataService();

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(fakeDataServiceInst.products(req.query)));
});

router.get('/products/suggested', function (req, res, next) {
    var fakeDataServiceInst = new fakeDataService();

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(fakeDataServiceInst.products(req.query)));
});

module.exports = router;
