!function (angular, _) {
    'use strict';

    var module = angular.module('DOOK.UI', [
        //'angular-inview',
        'ui.bootstrap'
    ]);

    module.directive('uiStickyNav', ['$document', '$window', 'throttle', 'uiState', directive]);

    function directive($document, $window, throttle, uiState) {
        return {
            restrict: 'AE',
            scope: {
                scrollerSelector: '=',
                isSticky: '='
            },
            link: link
        };

        function link(scope, element) {
            var options = {};

            var $bodyElement = $document.find('body');

            var $el;
            var handle;

            var destroy = function () {
                if ($el && handle)
                    $el.off('scroll', handle);
            };

            var init = function (selector) {
                destroy();

                var $scrollableElement = $bodyElement.find(selector)[0] || $window;

                var onChange = getOnChange(scope, uiState);
                var scrolling = new Scrolling($document, $scrollableElement, options, onChange);

                handle = throttle(angular.bind(scrolling, scrolling.handle), 250);

                handle();

                $el = angular.element($scrollableElement).on('scroll', handle);
            };

            scope.$watch(function () {
                return scope.scrollerSelector;
            }, init);

            scope.$on('destroy', destroy);
        }

        function getOnChange(scope, uiState) {
            return {
                onUpDown: function (isSticky) {
                    scope.$apply(function () {
                        uiState.switch('isSticky', isSticky);
                    })
                },
                atTop: function (isAtTop) {
                    scope.$apply(function () {
                        uiState.switch('isAtTop', isAtTop);
                    })
                },
                atBottom: function (isAtBottom) {
                    scope.$apply(function () {
                        uiState.switch('isAtBottom', isAtBottom);
                    })
                }
            }
        }
    }

    function Scrolling($document, $window, options, change) {
        this.$document = $document;
        this.$window = $window;

        this.options = options;
        this.change = change;

        this.dHeight = 0;
        this.wHeight = 0;
        this.current = 0;
        this.previous = 0;
        this.diff = 0;
    }

    angular.extend(Scrolling.prototype, {

        atTop: function () /* boolean */ {
            return (this.current || 0) <= 50;
        },

        atBottom: function () /* boolean */ {
            return (this.current + this.wHeight) >= this.dHeight;
        },

        down: function () /* boolean */ {
            return this.diff < 0;
        },

        handle: function () /* void */ {
            var scrolling = this.update();

            this.change.onUpDown(this.current >= 1 && scrolling.down());
            this.change.atTop(scrolling.atTop());
            this.change.atBottom(scrolling.atBottom());
        },

        update: function () /* Scrolling */ {
            this.dHeight = this.$document.prop('body').offsetHeight;
            this.wHeight = this.$window.innerHeight;

            this.previous = this.current;
            this.current = this.$window.scrollTop || this.$window.pageYOffset;
            this.diff = this.previous - this.current;

            return this;
        }

    });

    module.factory('throttle', ['$timeout', throttle]);

    function throttle($timeout) {
        return function (func /* () => void */, threshold /* number */) /* () => void */ {
            var timer, previous = +new Date();
            return function () {
                function execute() {
                    func.apply(this, arguments);
                    previous = current;
                }

                var fn = execute.bind(this, arguments);

                var current = +new Date();
                if (current > (previous + threshold)) {
                    fn();
                } else {
                    $timeout.cancel(timer);
                    timer = $timeout(fn, threshold);
                }
            }
        }
    }

    module.service('uiState', [function () {
        var statesContainer = {};

        var uiState = this;

        uiState.get = function (name, customStatesContainer) {
            var container = customStatesContainer || statesContainer;
            return container[name];
        };

        uiState.isAny = function () {
            var customStatesContainer;
            if (_.isObject(arguments[arguments.length - 1])) {
                customStatesContainer = arguments[arguments.length - 1];
                arguments.pop();
            }
            var container = customStatesContainer || statesContainer;

            var name = arguments[0];
            var values = Array.prototype.slice.call(arguments).splice(1);

            return _.isUndefined(_.find(values, function (val) {
                    return container[name] === val;
                })) === false;
        };

        uiState.is = function (name, val, customStatesContainer) {
            var container = customStatesContainer || statesContainer;

            if (_.isUndefined(val) || _.isNull(val))
                return container[name] === true;
            else
                return container[name] === val;
        };

        var multiSwitch = function (val, args) {
            var customStatesContainer;
            if (_.isObject(args[args.length - 1])) {
                customStatesContainer = args[args.length - 1];
                args.pop();
            }
            var container = customStatesContainer || statesContainer;
            _.each(args, function (propName) {
                if (!_.isString(propName)) {
                    throw new Error('uiState: prop name should be string.');
                }

                if (_.isBoolean(container[propName])
                    || _.isUndefined(container[propName])
                    || _.isNull(container[propName])) {
                    container[propName] = val;
                }
            });
        };

        uiState.switchOn = function () {
            multiSwitch(true, arguments);

            return uiState;
        };

        uiState.switchOff = function () {
            multiSwitch(false, arguments);

            return uiState;
        };

        this.switch = function (name, val, customStatesContainer) {
            var container = customStatesContainer || statesContainer;
            if (_.isObject(name)) {
                _.extend(container, name);
                return;
            }
            if (_.isUndefined(val) || _.isNull(val))
                container[name] = !container[name];
            else {
                container[name] = val;
            }

            return uiState;
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

    module.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            compile: function () {
                return function (scope, element, attr) {
                    var compileScope = scope;

                    var init = function (value) {
                        element.html(value && value.toString());

                        if (attr.bindHtmlScope) {
                            compileScope = scope.$eval(attr.bindHtmlScope);
                        }

                        $compile(element.contents())(compileScope);
                    };

                    var getHtml = function () {
                        return scope.$eval(attr.bindHtmlCompile);
                    };

                    if ('watch' in attr) {
                        scope.$watch(getHtml, init);
                    } else {
                        init(getHtml());
                    }
                }
            }
        };
    }]);

    _.each({
        full: function (top, left, height, width) {
            return top >= window.pageYOffset &&
                left >= window.pageXOffset &&
                (top + height) <= (window.pageYOffset + window.innerHeight) &&
                (left + width) <= (window.pageXOffset + window.innerWidth)
        },
        any: function (top, left, height, width) {
            return (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset &&
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth)
        },
        half: function (top, left, height, width) {
            return ((top + height / 2 < (window.pageYOffset + window.innerHeight) &&
                top + height / 2 > window.pageYOffset)
                || (
                    (top < (window.pageYOffset ) &&
                    top + height > window.pageYOffset + window.innerHeight)
                )) &&
                left >= window.pageXOffset &&
                (left + width) <= (window.pageXOffset + window.innerWidth)
        }
    }, function (is, key) {
        var directiveName = 'inView' + key.charAt(0).toUpperCase() + key.slice(1);
        module.directive(directiveName, [
            '$window',
            function ($window) {
                return {
                    scope: false,
                    link: function (scope, element, attr) {
                        function elementInViewport(el, type) {
                            var top = el.offsetTop;
                            var left = el.offsetLeft;
                            var width = el.offsetWidth;
                            var height = el.offsetHeight;

                            while (el.offsetParent) {
                                el = el.offsetParent;
                                top += el.offsetTop;
                                left += el.offsetLeft;
                            }

                            return is(top, left, height, width);
                        }

                        var windowEl = angular.element($window);
                        var handler = function () {
                            if (elementInViewport(element[0])) {
                                scope.$eval(attr[directiveName]);
                            }
                        };
                        windowEl.on('scroll', scope.$apply.bind(scope, handler));
                    }
                };
            }
        ]);
    });

}(angular, _);