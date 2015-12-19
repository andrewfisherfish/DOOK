/**
 * Created by andre on 12/19/2015.
 */
(function (angular, document, _) {
    var module = angular.module('Lectures.Book.DTO', []);

    module.service('loremIpsumService', ['$http', function ($http) {
        _.extend(this, {
            get: function (messageLength) {
                messageLength = messageLength || 1500;
                return $http({
                    method: 'GET',
                    url: '/api/loremIpsum'
                }).then(function successCallback(response) {
                    var message = response.data;
                    var getRandomInt = function (min, max) {
                        if (min === max)return min;
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    var msg = message
                    //.replace(/[^a-zA-Z-\s]/g, '')
                        .substr(getRandomInt(0, message.length - Math.min(message.length, messageLength)),
                            messageLength)
                        .trim();

                    return msg.charAt(0).toUpperCase() + msg.slice(1) + '.';
                });
            }
        });
    }]);

}(angular, document, _));