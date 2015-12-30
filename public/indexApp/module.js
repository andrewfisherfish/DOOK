/**
 * Created by andre on 11/22/2015.
 */
(function (angular, document, _) {
    var module = angular.module('Lectures.Account', [
        'ui.bootstrap',
        'Lectures.UI',
        'Lectures.DTO',
        'angular.filter'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.run(['$rootScope', 'uiState', function ($rootScope, uiState) {
        $rootScope.uiState = uiState;
    }]);

    module.controller('mainCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    }]);

    module.directive('fillWithLoremIpsum', ['loremIpsumService', '$compile',
        function (loremIpsumService, $compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var length = (attr.fillWithLoremIpsum || 1000) * 1;
                    if ('max' in attr && 'min' in attr) {
                        length = getRandomInt(attr.min * 1, attr.max * 1)
                    }
                    loremIpsumService.get(length).then(function (data) {
                        $compile(element.contents())(scope);

                        if ('isPrice' in attr) {
                            data = getRandomInt(50, 100);
                        }

                        if ('isTitle' in attr || 'isName' in attr) {
                            data = data.replace(/[^a-zA-Z-\s]/g, '');
                        }

                        if ('isName' in attr) {
                            var name = [
                                (data.charAt(0).toUpperCase() + data.substring(1, 5).toLowerCase()).replace(/[^a-zA-Z]/g, ''),
                                (data.charAt(6).toUpperCase() + data.substring(6, 11).toLowerCase()).replace(/[^a-zA-Z]/g, '')
                            ];

                            data = name.join(' ');
                        }

                        if ('isText' in attr) {
                            if (data.charAt(data.length - 1) != '.')
                                data += '.';
                        }

                        element.html(data);
                        return data;
                    });
                }
            }
        }
    ]);

    var getRandomInt = function (min, max) {
        if (min === max)return min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    function n(n) {
        return n > 9 ? "" + n : "0" + n;
    }

    var getUsers = function (max, showName) {
        var authors = [];
        var length = getRandomInt(1, max || 5);

        for (var i = 1; i <= length; i++) {
            authors.push({
                src: '/img/avatar_0' + i + '.jpg',
                showName: showName && length > 1,
                name: "Bob Marley"
            });
        }

        return shuffle(authors);
    };

    module.directive('product', ['$sce', function ($sce) {
        return {
            replace: true,
            templateUrl: '/indexApp/views/product.html',
            link: function (scope) {
                scope.authors = getUsers(3);
                scope.productImageSrc = '/img/products/product-' + n(getRandomInt(1, 17)) + '.jpg';

                var productTypes = ['book', 'lecture'];

                var randomIndex = getRandomInt(0, 1);

                scope.productType = productTypes[randomIndex];

                var productCategories = ['books', 'courses'];

                scope.productCategory = productCategories[randomIndex];

                scope.prodAttr = [];

                scope.productDropDown = _.uniqueId('productDropDown_');

                switch (scope.productType) {
                    case productTypes[0]:
                        scope.bottomButton = {
                            link: '/product',
                            caption: 'read'
                        };
                        scope.prodAttr.push($sce.trustAsHtml('Pages: <span>244</span>'));
                        break;
                    case productTypes[1]:
                        scope.bottomButton = {
                            link: '/product',
                            caption: 'start'
                        };
                        scope.prodAttr.push($sce.trustAsHtml('Lectures: <span>10 + 2 bonus</span>'));
                        scope.prodAttr.push($sce.trustAsHtml('Duration: <span>3 month</span>'));
                        break;
                    default:
                        break;
                }
            }
        }
    }]);

    module.directive('user', [function () {
        return {
            replace: true,
            scope: {
                model: '='
            },
            templateUrl: '/indexApp/views/user.html',
            link: function (scope, el, attr) {

            }
        }
    }]);

    module.directive('searchTag', [function () {
        return {
            replace: true,
            templateUrl: '/indexApp/views/search-tag.html',
            link: function (scope, el, attr) {
                if (_.isUndefined(attr.href)) {
                    el.bind('click', function () {
                        el.toggleClass('active');
                    });
                }
            }
        }
    }]);

    module.controller('productCtrl', [function () {
        this.authors = getUsers(3, false);
        this.productImageSrc = '/img/products/product-' + n(getRandomInt(1, 17)) + '.jpg';
    }]);

}(angular, document, _));