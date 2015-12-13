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

    module.run(['$rootScope', '$filter', function ($rootScope, $filter) {
        _.each(fakeData.items, function (item, index) {
            _.extend(item, {
                text: '...nec magna eros quis ac nec tortor nunc massa. Non sit neque diam mus nulla. Suspendisse porta ...',
                dateTime: helper.randomDate(new Date(2012, 0, 1), new Date())
            });
            item.formattedDateTime = $filter('date')(item.dateTime, 'yyyyMM');
        });

        $rootScope.items = fakeData.items;
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

    module.directive('footer', ['$timeout', function ($timeout) {
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