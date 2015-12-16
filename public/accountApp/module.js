/**
 * Created by andre on 11/22/2015.
 */
(function (angular, _) {
    var module = angular.module('Account', [
        'ui.bootstrap',
        'Lectures.UI',
        'angular.filter',
        'mn'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.controller('mainCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    }]);

}(angular, _));