/**
 * Created by andre on 11/22/2015.
 */
(function (angular, document, _) {
    var module = angular.module('Lectures.Account', [
        'ui.bootstrap',
        'Lectures.UI',
        'Lectures.DTO',
        'Lectures.Utils',
        'angular.filter'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.run(['$rootScope', 'uiState', '$window', function ($rootScope, uiState, $window) {
        $rootScope.uiState = uiState;

        (function initStateResizer() {

            var sizes = {
                'screen-xs-max': 480 - 1,
                'screen-sm-max': 768 - 1,
                'screen-md-max': 992 - 1
            };

            var getSize = function () {
                return {
                    'h': $window.innerHeight,
                    'w': $window.innerWidth
                };
            };

            var initStates = function (newValue) {
                uiState.switch('screen-xs', newValue.w < sizes['screen-xs-max']);
                uiState.switch('screen-sm', newValue.w < sizes['screen-sm-max'] && newValue.w >= sizes['screen-xs-max']);
                uiState.switch('screen-md', newValue.w < sizes['screen-md-max'] && newValue.w >= sizes['screen-sm-max']);
                uiState.switch('screen-lg', newValue.w >= sizes['screen-md-max']);
            };

            initStates(getSize());

            angular.element($window).bind('resize', function () {
                initStates(getSize());
            });
        }());
    }]);

    module.controller('mainCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    }]);

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

    module.directive('userLoggedIn', [function () {
        return {
            replace: true,
            templateUrl: '/indexApp/views/user-logged-in.html',
            link: function (scope, el, attr) {
                scope.model = getUsers(1, true)[0];
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