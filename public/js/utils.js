/**
 * Created by andre on 1/3/2016.
 */
(function (angular, document, _) {
    var module = angular.module('Lectures.Utils', [
        'Lectures.DTO'
    ]);

    var getRandomInt = function (min, max) {
        if (min === max)return min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var helper = {
        randomInt: function (min, max) {
            if (min === max)return min;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        randomDate: function (start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }
    };

    module.constant('helper', helper);

    module.directive('fillWithLoremIpsum', ['loremIpsumService', '$compile', '$filter',
        function (loremIpsumService, $compile, $filter) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var length = (attr.fillWithLoremIpsum || 1000) * 1;
                    if ('max' in attr && 'min' in attr) {
                        length = getRandomInt(attr.min * 1, attr.max * 1)
                    }
                    loremIpsumService.get(length).then(function (data) {
                        $compile(element.contents())(scope);

                        if ('isDate' in attr) {
                            data = helper.randomDate(new Date(2012, 0, 1), new Date())
                        }

                        if ('isMedium' in attr) {
                            data = $filter('date')(data, 'medium')
                        }

                        if ('isFormatted' in attr) {
                            data = $filter('date')(data, 'yyyyMM');
                        }

                        if ('isPrice' in attr) {
                            data = getRandomInt(50, 100);
                        }

                        if ('isTitle' in attr || 'isName' in attr) {
                            data = data.replace(/[^a-zA-Z-\s]/g, '');
                        }

                        if ('isName' in attr) {
                            var name = [
                                (data.charAt(0).toUpperCase() + data.substring(1, 5).toLowerCase()).replace(/[^a-zA-Z]/g, ''),
                                (data.charAt(6).toUpperCase() + data.substring(6, 11).toLowerCase()).replace(/[^a-zA-Z]/g, '')
                            ];

                            data = name.join(' ');
                        }

                        if ('isText' in attr) {
                            if (data.charAt(data.length - 1) != '.')
                                data += '.';
                        }

                        element.html(data);
                        return data;
                    });
                }
            }
        }
    ]);
}(angular, document, _));