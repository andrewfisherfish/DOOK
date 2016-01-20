/**
 * Created by andre on 12/19/2015.
 */
(function (angular, document, _) {
    var module = angular.module('DOOK.DTO', []);

    module.service('loremIpsumService', ['$http', '$compile', function ($http, $compile) {

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

    module.service('authorsService', ['$http', function ($http) {
        this.get = function () {
            return $http({
                method: 'GET',
                url: '/api/products/liked',
                params: _.extend(params || {}, {
                    pageNumber: -1,
                    pageLength: 10
                })
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        this.book = function (params) {
            params = _.extend(params || {}, {
                pageNumber: -1,
                pageLength: 10
            });
            return $http({
                method: 'GET',
                url: '/api/products/liked',
                params: {
                    pageNumber: -1,
                    pageLength: 10,
                    bookId: _.uniqueId()
                }
            }).then(function successCallback(response) {
                return response.data;
            });
        };
    }]);

    module.service('productsService', ['$http', function ($http) {
        this.get = function (params) {
            return $http({
                method: 'GET',
                url: '/api/product',
                params: _.extend(params || {}, {
                    id: _.uniqueId(),
                    userId: _.uniqueId()
                })
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        var defParamsForListings = {
            pageNumber: -1,
            pageLength: 10,
            userId: _.uniqueId()
        };

        this.recent = function (params) {
            return $http({
                method: 'GET',
                url: '/api/products/recent',
                params: _.extend(params || {}, defParamsForListings)
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        this.purchased = function (params) {
            return $http({
                method: 'GET',
                url: '/api/products/purchased',
                params: _.extend(params || {}, defParamsForListings)
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        this.liked = function (params) {
            return $http({
                method: 'GET',
                url: '/api/products/liked',
                params: _.extend(params || {}, defParamsForListings)
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        this.suggested = function (params) {
            return $http({
                method: 'GET',
                url: '/api/products/suggested',
                params: _.extend(params || {}, defParamsForListings)
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        this.look = function (params) {
            return $http({
                method: 'GET',
                url: '/api/products',
                params: _.extend(params || {}, defParamsForListings)
            }).then(function successCallback(response) {
                return response.data;
            });
        };
    }]);

    module.service('notificationsService', ['$http', function ($http) {
        this.get = function (params) {
            return $http({
                method: 'GET',
                url: '/api/product',
                params: _.extend(params || {}, {
                    id: _.uniqueId(),
                    userId: _.uniqueId()
                })
            }).then(function successCallback(response) {
                return response.data;
            });
        };

        var defParamsForListings = {
            pageNumber: -1,
            pageLength: 10,
            userId: _.uniqueId()
        };

        this.look = function (params) {
            return $http({
                method: 'GET',
                url: '/api/notifications',
                params: _.extend(params || {}, defParamsForListings)
            }).then(function successCallback(response) {
                return response.data;
            });
        };
    }]);

}(angular, document, _));