/**
 * Created by andre on 12/19/2015.
 */
(function (angular, document, _) {
    var module = angular.module('DOOK.DTO', []);

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

    module.service('loremIpsumService', ['$http', '$compile', function ($http, $compile) {
        var getText = function (msgLength) {
            msgLength = msgLength || 10000;

            return $http({
                method: 'GET',
                url: '/api/loremIpsum',
                cache: true
            }).then(function successCallback(response) {
                var message = response.data;
                var start = getRandomInt(0, message.length - Math.min(message.length, msgLength));
                return message.substr(start, msgLength).trim();
            });
        };

        var onlyLetters = function (data) {
            return data.replace(/[^a-zA-Z-\s]/g, '');
        };

        _.extend(this, {
            get: getText,
            getTitle: function (min, max) {
                max = max || min;
                var len = getRandomInt(min, max);
                return getText(len).then(function (data) {
                    return onlyLetters(data);
                });
            },
            getName: function () {
                return getText(30).then(function (data) {
                    data = onlyLetters(data);

                    var name = [
                        (data.charAt(0).toUpperCase() + data.substring(1, 5).toLowerCase()).replace(/[^a-zA-Z]/g, ''),
                        (data.charAt(6).toUpperCase() + data.substring(6, 11).toLowerCase()).replace(/[^a-zA-Z]/g, '')
                    ];

                    return name.join(' ');
                });
            },
            getAvatar: function () {
                return '/img/avatar_0' + getRandomInt(1, 5) + '.jpg';
            }
        });
    }]);

    module.service('authorsService', ['promiseWrapper', 'loremIpsumService', function (promiseWrapper, loremIpsumService) {
        var author = function () {
            return {
                src: loremIpsumService.getAvatar(),
                name: loremIpsumService.getName()
            }
        };

        var getAuthors = function (max) {
            var authors = [];
            var length = getRandomInt(1, max || 3);

            for (var i = 1; i <= length; i++) {
                authors.push(author());
            }

            return shuffle(authors);
        };

        this.author = function () {
            return promiseWrapper.create(author());
        };

        this.bookAuthors = function () {
            return promiseWrapper.create(getAuthors());
        };
    }]);

    module.service('productsService', ['promiseWrapper', 'loremIpsumService', '$sce', function (promiseWrapper, loremIpsumService, $sce) {
        var product = function () {
            var productTypes = ['book', 'lecture'];
            var randomIndex = getRandomInt(0, 1);
            var productCategories = ['books', 'courses'];

            var product = {
                imgSrc: '/img/products/product-' + n(getRandomInt(1, 17)) + '.jpg',
                title: loremIpsumService.getText(15),
                productType: productTypes[randomIndex],
                productCategory: productCategories[randomIndex],
                prodAttr: [],
                authors: []
            };

            switch (product.productType) {
                case productTypes[0]:
                    product.prodAttr.push($sce.trustAsHtml('Pages: <span>244</span>'));
                    break;
                case productTypes[1]:
                    product.prodAttr.push($sce.trustAsHtml('Lectures: <span>10 + 2 bonus</span>'));
                    product.prodAttr.push($sce.trustAsHtml('Duration: <span>3 month</span>'));
                    break;
                default:
                    break;
            }
        };

        var getProducts = function () {
            var products = [];
            var length = getRandomInt(1, max || 3);

            for (var i = 1; i <= length; i++) {
                products.push(product());
            }

            return shuffle(authors)
        };

        this.recent = function () {
            return promiseWrapper.create(getProducts());
        };

        this.purchased = function () {
            return promiseWrapper.create(getProducts());
        };

        this.liked = function () {
            return promiseWrapper.create(getProducts());
        };
    }]);

}(angular, document, _));