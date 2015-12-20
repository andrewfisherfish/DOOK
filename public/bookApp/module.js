/**
 * Created by andre on 11/22/2015.
 */
(function (angular, document, _) {
    var module = angular.module('Lectures.Book', [
        'Lectures.UI',
        'Lectures.DTO',
        'ui.bootstrap',
        'angular.filter',
        'ngTouch'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.run(['$rootScope', '$filter', 'uiState', 'loremIpsumService',
        function ($rootScope, $filter, uiState, loremIpsumService) {
            _.each(fakeData.items, function (item, index) {
                _.extend(item, {
                    text: '...nec magna eros quis ac nec tortor nunc massa. Non sit neque diam mus nulla. Suspendisse porta ...',
                    dateTime: helper.randomDate(new Date(2012, 0, 1), new Date())
                });
                item.formattedDateTime = $filter('date')(item.dateTime, 'yyyyMM');
            });

            $rootScope.items = fakeData.items;

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

    module.directive('displayText', ['loremIpsumService', '$compile', '$window', function (loremIpsumService, $compile, $window) {
        var fillData = function (scope, element) {
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
            link: fillData,
            controller: ['$element', '$scope', function ($element, $scope) {
                fillData($scope, $element);
                this.open = function () {
                    return fillData($scope, $element);
                }
            }]
        }
    }]);

    module.directive('preview', ['loremIpsumService', '$uibModal', '$compile', function (loremIpsumService, $uibModal, $compile) {
        return {
            require: ['?^modal', '?^displayText'],
            scope: false,
            link: function (scope, el, attr, ctrl) {
                var modalInstance;
                var modalCtrl = ctrl[0];
                var displayTextCtrl = ctrl[1];
                var tagPhrase = el.html();

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
                                    open: function () {
                                        displayTextCtrl.open()
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

    var helper = {
        randomDate: function (start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }
    };

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