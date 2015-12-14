/**
 * Created by andre on 11/22/2015.
 */
(function (angular, _) {
    var module = angular.module('Lectures', [
        'ngTouch',
        'ui.bootstrap',
        'Lectures.UI',
        'angular.filter'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.run(['$rootScope', '$filter', 'uiState', function ($rootScope, $filter, uiState) {
        _.each(fakeData.items, function (item, index) {
            _.extend(item, {
                text: '...nec magna eros quis ac nec tortor nunc massa. Non sit neque diam mus nulla. Suspendisse porta ...',
                dateTime: helper.randomDate(new Date(2012, 0, 1), new Date())
            });
            item.formattedDateTime = $filter('date')(item.dateTime, 'yyyyMM');
        });

        $rootScope.items = fakeData.items;

        $rootScope.uiState = uiState;
    }]);

    module.controller('mainCtrl', ['$scope', function ($scope) {

    }]);

    var helper = {
        randomDate: function (start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }
    };

    _.each([
        'test',
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
                templateUrl: '/app/views/' + directiveName + '.html',
                scope: {
                    item: '='
                }
            }
        }]);
    });

    module.directive('onPhraseMenu', ['$uibModal', function ($uibModal) {
        return {
            link: function (scope, el) {
                el.bind('click', function () {
                    scope.$apply(function () {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: '/app/views/modal-selection-context-menu.html',
                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            }],
                            size: 'sm',
                            windowClass: 'quick-menu'
                        });
                    })
                });
            }
        }
    }]);

    module.directive('footerParent', [function () {
        return {
            restrict: 'C',
            scope: false,
            controller: ['$element', function ($element) {
                this.setPadding = function (val) {
                    $element.css({'padding-bottom': val + 'px'});
                }
            }]
        }
    }]);

    module.directive('footer', [function () {
        return {
            restrict: 'C',
            require: '^footerParent',
            scope: false,
            link: function (scope, el, attr, ctrl) {
                ctrl.setPadding(el[0].offsetHeight);
            }
        }
    }]);

}(angular, _));