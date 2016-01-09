/**
 * Created by andre on 11/22/2015.
 */
(function (angular, document, _) {
    var module = angular.module('DOOK.Book', [
        'DOOK.UI',
        'DOOK.DTO',
        'DOOK.Utils',
        'angular.filter',
        'ngTouch'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.run(['$rootScope', '$filter', 'uiState', 'loremIpsumService',
        function ($rootScope, $filter, uiState, loremIpsumService) {
            $rootScope.uiState = uiState;

            var openText = function () {
                return loremIpsumService.get().then(function (data) {
                    $rootScope.loremIpsum = data;
                    $rootScope.loremIpsumReady = true;
                    return data;
                });
            };

            $rootScope.openText = openText;
        }
    ]);

    module.controller('mainCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {
        $scope.openSettingsDialog = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/bookApp/views/modal-settings-context-menu.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }],
                size: 'sm',
                windowClass: 'quick-menu'
            });
        };
        $scope.openQuestionDialog = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/bookApp/views/modal-question-context-menu.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }],
                size: 'sm',
                windowClass: 'quick-menu'
            });
        };
        $scope.openOnWordDialog = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/bookApp/views/modal-selection-context-menu.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }],
                size: 'sm',
                windowClass: 'quick-menu'
            });
        }
    }]);

    module.directive('modal', [function () {
        return {
            restrict: 'C',
            scope: false,
            controller: ['$element', '$scope', function ($element, $scope) {
                _.extend(this, {
                    $scope: $scope,
                    $element: $element,
                    scrollTop: function () {
                        $element[0].scrollTop = 0;
                    }
                });
            }]
        }
    }]);

    module.directive('bookReaderParent', ['loremIpsumService', '$compile', '$window', function (loremIpsumService, $compile, $window) {
        return {
            restrict: 'A',
            controller: ['$element', '$scope', function ($element, $scope) {
                var self = this;
                this.minimized = [];
                this.minimizedPush = function (data) {
                    var index = _.findIndex(self.minimized, function (o) {
                        return o.tagPhrase === data.tagPhrase;
                    });

                    if (index > -1) {
                        self.minimized.splice(index, 1);
                    }

                    var cutOffLen = self.minimized.length - Math.floor($window.innerWidth / 65) + 1;

                    if (cutOffLen > 0) {
                        self.minimized.splice(0, cutOffLen);
                    }

                    self.minimized.push(data);
                };
                this.open = function () {
                    throw new Error('text container is not initialized yet');
                }
            }]
        }
    }]);

    module.directive('bookReaderFooter', ['loremIpsumService', '$compile', '$window',
        function (loremIpsumService, $compile, $window) {
            return {
                restrict: 'A',
                replace: true,
                require: '^bookReaderParent',
                templateUrl: '/bookApp/views/bookReaderFooter.html',
                link: function (scope, element, attr, ctrl) {
                    scope.$watch(function () {
                        return ctrl.minimized;
                    }, function (list) {
                        scope.minimized = list;
                    });

                    scope.remove = function (item, $index) {
                        ctrl.minimized.splice($index, 1);
                    };
                }
            }
        }
    ]);

    module.directive('randomBackgroundColor', ['helper', function (helper) {
        return function (scope, element, attr) {
            element.css('background-color', 'rgba(' + helper.randomInt(0, 255) + ',' + helper.randomInt(0, 255) + ',' + helper.randomInt(0, 255) + ',0.8)');
        }
    }]);

    module.directive('bookReaderText', ['loremIpsumService', '$compile', '$window', 'uiState',
        function (loremIpsumService, $compile, $window, uiState) {
            var fillData = function (scope, element, attr, ctrl) {
                return loremIpsumService.get().then(function (data) {
                    element.html(data);
                    $compile(element.contents())(scope);
                    return data;
                }).then(function () {
                    $window.scrollTo(0, 0);
                });
            };
            return {
                restrict: 'A',
                require: '^bookReaderParent',
                link: function (scope, element, attr, ctrl) {
                    fillData(scope, element);
                    ctrl.open = function () {
                        uiState.switchOff('isContents', 'isMenu', 'isSearch');
                        return fillData(scope, element);
                    };
                },
                controller: ['$element', '$scope', function ($element, $scope) {
                    fillData($scope, $element);
                }]
            }
        }
    ]);


    module.directive('preview', ['loremIpsumService', '$uibModal', '$compile', function (loremIpsumService, $uibModal, $compile) {
        return {
            require: ['?^modal', '?^bookReaderText', '^bookReaderParent'],
            scope: false,
            restrict: 'AE',
            link: function (scope, el, attr, ctrl) {
                var modalInstance;
                var modalCtrl = ctrl[0];
                var bookReaderTextCtrl = ctrl[1];
                var bookReaderParentCtrl = ctrl[2];
                var tagPhrase = attr.preview || el.html();

                var openHere = function () {
                    return loremIpsumService.get().then(function (data) {
                        scope.tagPhrase = tagPhrase;
                        scope.loremIpsum = data;
                    }).then(modalCtrl.scrollTop);
                };
                var openFromModal = function () {
                    modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/bookApp/views/modal-chapter-context-menu.html',
                        controller: ['$scope', '$uibModalInstance', 'loremIpsum',
                            function ($scope, $uibModalInstance, loremIpsum) {
                                _.extend($scope, {
                                    isModal: true,
                                    tagPhrase: tagPhrase,
                                    loremIpsum: loremIpsum,
                                    minimize: function () {
                                        bookReaderParentCtrl.minimizedPush({
                                            caption: tagPhrase.slice(0, 2),
                                            tagPhrase: tagPhrase
                                        });
                                        $uibModalInstance.dismiss();
                                    },
                                    open: function () {
                                        bookReaderParentCtrl.open()
                                            .then($uibModalInstance.dismiss);
                                    },
                                    cancel: function () {
                                        $uibModalInstance.dismiss('cancel');
                                    }
                                });
                            }
                        ],
                        resolve: {
                            loremIpsum: ['loremIpsumService', function (loremIpsumService) {
                                return loremIpsumService.get();
                            }]
                        },
                        windowClass: 'modal-preview'
                    });
                };

                el.bind('click', function () {
                    scope.$apply(scope.isModal ? openHere : openFromModal);
                });
            }
        }
    }]);

    _.each([
        'history',
        'contents',
        'bookmark',
        'searchTextResult',
        'searchChapterResult'
    ], function (directiveName) {
        module.directive(directiveName, [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/bookApp/views/' + directiveName + '.html',
                scope: {
                    item: '='
                }
            }
        }]);
    });

}(angular, document, _));