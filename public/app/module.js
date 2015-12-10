/**
 * Created by andre on 11/22/2015.
 */
(function (angular) {
    var module = angular.module('Lectures', [
        'ngTouch',
        'ui.bootstrap',
        'Lectures.UI'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    _.each(['test', 'history', 'menu'], function (name) {
        module.directive(name, ['fakeData', function (fakeData) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: '/app/views/' + name + '.html',
                link: function (scope) {
                    scope.items = fakeData.history;
                }
            }
        }]);
    });

    module.run(['$rootScope', function ($rootScope) {

    }]);

    module.controller('mainCtrl', ['$scope', function ($scope) {

    }])
}(angular));