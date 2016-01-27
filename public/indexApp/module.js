/**
 * Created by andre on 11/22/2015.
 */
(function (angular, document, _) {
        var module = angular.module('DOOK.Account', [
            'DOOK.UI',
            'DOOK.DTO',
            'DOOK.Utils',
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
                    if (newValue.w < sizes['screen-xs-max']) {
                        uiState.switch('screen-size', 'screen-xs');
                    } else if (newValue.w < sizes['screen-sm-max'] && newValue.w >= sizes['screen-xs-max']) {
                        uiState.switch('screen-size', 'screen-sm');
                    } else if (newValue.w < sizes['screen-md-max'] && newValue.w >= sizes['screen-sm-max']) {
                        uiState.switch('screen-size', 'screen-md');
                    } else if (newValue.w >= sizes['screen-md-max']) {
                        uiState.switch('screen-size', 'screen-lg');
                    } else {
                        uiState.switch('screen-size', 'screen-none');
                    }
                };

                initStates(getSize());

                angular.element($window).bind('resize', function () {
                    $rootScope.$apply(function () {
                        initStates(getSize());
                    });
                });
            }());
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
                scope: {
                    model: '=model'
                },
                replace: true,
                templateUrl: '/indexApp/views/product.html',
                link: function (scope, element, attr) {
                    scope.isShort = 'short' in attr;
                    scope.isPurchased = 'purchased' in attr;

                    var productTypes = ['book', 'lecture'];

                    scope.prodAttr = [];

                    scope.productDropDown = _.uniqueId('productDropDown_');

                    _.each(scope.model.prodAttr, function (prodAttr, index) {
                        try {
                            scope.model.prodAttr[index] = $sce.trustAsHtml(prodAttr);
                        }
                        catch (error) {
                            //if not valid html string
                            //console.log(error);
                        }
                    });

                    switch (scope.model.productType) {
                        case productTypes[0]:
                            scope.bottomButton = {
                                link: '/product',
                                caption: 'read'
                            };
                            break;
                        case productTypes[1]:
                            scope.bottomButton = {
                                link: '/product',
                                caption: 'start'
                            };
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
                link: function (scope, element, attr) {
                    if (_.isUndefined(attr.href)) {
                        element.bind('click', function () {
                            element.toggleClass('active');
                        });
                    }
                }
            }
        }]);

        module.directive('notification', [function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    model: '='
                },
                templateUrl: '/indexApp/views/notification.html',
                link: function (scope, element, attr) {
                    switch (scope.model.type) {
                        case 'new-book':
                            scope.preText = 'New book is out:';
                            scope.text = scope.model.product.title;
                            scope.postText = 'by ' + scope.model.authors.map(function (author) {
                                    return author.name;
                                }).join(', ');
                            scope.category = 'BOOKS';
                            scope.showCategoryIcon = true;
                            break;
                        case 'new-lecture':
                            scope.preText = 'New lecture is availabe:';
                            scope.text = scope.model.product.title;
                            scope.postText = 'by ' + scope.model.authors.map(function (author) {
                                    return author.name;
                                }).join(', ');
                            scope.category = 'LECTURES';
                            scope.showCategoryIcon = true;
                            break;
                        case  'internal-alert':
                            scope.preText = 'DOOK ALERT: ';
                            scope.text = scope.model.text;
                            break;
                        case  'new-author':
                            scope.preText = 'New author joined us. Please, welcome, ';
                            scope.text = scope.model.author.name;
                            scope.showUserIcon = true;
                            break;
                    }
                }
            }
        }]);

        module.controller('productDetailsCtrl', [function () {
            this.authors = getUsers(3, false);
        }]);

        var columnLayout = function (params) {
            var self = this;

            params = _.extend({columnsLength: 1}, params || {});

            var methods = {
                multi: {
                    init: function () {
                        self.model = self.model || new Array(params.columnsLength);
                    },
                    add: function (data) {
                        var len = Math.floor(data.length / params.columnsLength);
                        _.each(self.model, function (list, index) {
                            self.model[index] = (list || []).concat(self.model.length - 1 === index ? data : data.splice(0, len));
                        });
                        return self.model;
                    },
                    update: function (data) {
                        var len = Math.floor(data.length / params.columnsLength);
                        _.each(self.model, function (list, index) {
                            self.model[index] = self.model.length - 1 === index ? data : data.splice(0, len);
                        });
                        return self.model;
                    }
                },
                single: {
                    init: function () {
                        self.model = self.model || [];
                    },
                    add: function (data) {
                        self.model = self.model.concat(data);
                    },
                    update: function (data) {
                        self.model = data;
                    }
                }
            };

            if (params.columnsLength > 1)
                _.extend(self, methods.multi);
            else
                _.extend(self, methods.single);

            self.init();
        };

        module.controller('suggestionsCtrl', ['productsService', function (productsService) {
            var Suggestions = this;

            Suggestions.list = [];
            Suggestions.columnLayoutInst = new columnLayout({
                columnsLength: 2
            });

            productsService.suggested({
                pageNumber: 1,
                pageLength: 10
            }).then(Suggestions.columnLayoutInst.add);
        }]);

        module.controller('DashboardCtrl', ['uiState', 'productsService', function (uiState, productsService) {
            var Dashboard = this;

            Dashboard.productLists = {
                recent: {
                    columnsLength: 1
                },
                purchased: {
                    columnsLength: 1
                },
                liked: {
                    columnsLength: 3
                }
            };

            _.each(Dashboard.productLists, function (params, type) {
                Dashboard.productLists[type].columnLayoutInst = new columnLayout(params);

                productsService[type]({
                    pageNumber: 1,
                    pageLength: 10
                }).then(Dashboard.productLists[type].columnLayoutInst.add);
            });

            _.extend(Dashboard, {
                fullScreenMode: function (type) {
                    return productsService[type.toLowerCase()]({
                        pageNumber: 1,
                        pageLength: 10
                    }).then(function (data) {
                        uiState.switch({'FULL_SCREEN_TAB': type.toUpperCase(), 'ACCOUNT_TAB': type.toUpperCase()});

                        Dashboard.productLists[type.toLowerCase()].columnLayoutInst.update(data);

                        return data;
                    });
                },
                loadMore: function (type) {
                    return productsService[type.toLowerCase()]({
                        pageNumber: 1,
                        pageLength: 10
                    }).then(Dashboard.productLists[type.toLowerCase()].columnLayoutInst.add);
                },
                getModel: function (type) {
                    return Dashboard.productLists[type.toLowerCase()].columnLayoutInst.model;
                }
            });
        }]);

        module.controller('ProductsCtrl', ['uiState', 'productsService', function (uiState, productsService) {
            var Products = this;

            Products.columnLayoutInst = new columnLayout({
                columnsLength: 2
            });

            productsService.look({
                pageNumber: 1,
                pageLength: 10
            }).then(Products.columnLayoutInst.add);

            Products.loadMore = function () {
                productsService.look({
                    pageNumber: 1,
                    pageLength: 10
                }).then(Products.columnLayoutInst.add);
            };

        }]);

        module.controller('NavbarTopCtrl', ['uiState', 'notificationsService', function (uiState, notificationsService) {
            var NavbarTop = this;

            NavbarTop.columnLayoutInst = new columnLayout({
                columnsLength: 1
            });

            NavbarTop.fullScreenNotificationsMode = function () {
                notificationsService.look({
                    pageNumber: 1,
                    pageLength: 10
                }).then(NavbarTop.columnLayoutInst.add).then(function (data) {
                    uiState.switch({'FULL_SCREEN_TAB': 'NOTIFICATIONS'});

                    return data;
                });
            };

            NavbarTop.loadMoreNotifications = function () {
                notificationsService.look({
                    pageNumber: 1,
                    pageLength: 10
                }).then(NavbarTop.columnLayoutInst.add);
            };

        }]);

    }(angular, document, _)
);