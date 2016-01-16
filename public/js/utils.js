/**
 * Created by andre on 1/3/2016.
 */
(function (angular, document, _) {
    var module = angular.module('DOOK.Utils', [
        'DOOK.DTO'
    ]);

    var getRandomInt = function (min, max) {
        if (min === max)return min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    module.directive('fillWithLoremIpsum', ['loremIpsumService', '$compile', '$filter', 'helper',
        function (loremIpsumService, $compile, $filter, helper) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if ('isCover' in attr) {
                        element.css('background-image', 'url("/img/products/product-' + helper.formatInt(helper.randomInt(1, 17)) + '.jpg")');
                        return;
                    }

                    if ('isAvatar' in attr) {
                        element[0].src = '/img/avatar_0' + helper.randomInt(1, 5) + '.jpg';
                        return;
                    }

                    if ('isPrice' in attr) {
                        element.html(helper.randomInt(50, 100));
                        return;
                    }

                    if ('isDate' in attr) {
                        var data = helper.randomDate(new Date(2012, 0, 1), new Date());

                        if ('isMedium' in attr) {
                            data = $filter('date')(data, 'medium');
                        }

                        if ('isFormatted' in attr) {
                            data = $filter('date')(data, 'yyyyMM');
                        }

                        element.html(data);
                        return;
                    }

                    var length = (attr.fillWithLoremIpsum || 1000) * 1;

                    if ('max' in attr && 'min' in attr) {
                        length = helper.randomInt(attr.min * 1, attr.max * 1)
                    }

                    function initText() {
                        loremIpsumService.get(length).then(function (data) {
                            $compile(element.contents())(scope);

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

                            return data;
                        }).then(function (data) {
                            element.html(data);
                        });
                    }

                    initText();

                    scope.$on('reload', initText);
                }
            }
        }
    ]);

}(angular, document, _));