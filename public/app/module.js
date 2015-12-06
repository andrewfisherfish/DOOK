/**
 * Created by andre on 11/22/2015.
 */
(function (angular) {
    var module = angular.module('Lectures', [
        'ngTouch',
        'ui.bootstrap',
        'sticky'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('menuObj', window.menuObj);

    module.directive('menu', ['menuObj', function (menuObj) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/app/views/_menu.html',
            link: function (scope, el, attr) {
                scope.menu = menuObj;
            }
        }
    }]);

    module.run(['$rootScope', function ($rootScope) {
    }]);

    module.controller('mainCtrl', ['$scope', function ($scope) {

    }])
}(angular));