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

    module.controller('mainCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    }]);

    module.directive('fillWithLoremIpsum', ['loremIpsumService', '$compile',
        function (loremIpsumService, $compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    loremIpsumService.get((attr.fillWithLoremIpsum || 1000) * 1).then(function (data) {
                        element.html(data);
                        $compile(element.contents())(scope);
                        return data;
                    });
                }
            }
        }
    ]);

}(angular, document, _));