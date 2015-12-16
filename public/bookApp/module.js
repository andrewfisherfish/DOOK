/**
 * Created by andre on 11/22/2015.
 */
(function (angular, _) {
    var module = angular.module('Book', [
        'ui.bootstrap',
        'Lectures.UI',
        'angular.filter',
        'mn'
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

}(angular, _));