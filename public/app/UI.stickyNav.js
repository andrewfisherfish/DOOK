!function (angular) {
    'use strict';

    var module = angular.module('Lectures.UI', []);

    module.directive('stickyNav', ['$document', '$window', 'throttle', directive]);

    function directive($document, $window, throttle) {
        return {
            restrict: 'AE',
            scope: {
                cssClassHidden: '@?',
                bodyCssClassHidden: '@?',
                showAtBottom: '@?',
                scrollerSelector: '='
            },
            link: link
        };

        function link(scope, element) {
            var options = {
                cssClassHidden: scope.cssClassHidden || 'is-sticky',
                bodyCssClassHidden: scope.bodyCssClassHidden || 'has-sticky',
                showAtBottom: scope.showAtBottom ? scope.showAtBottom === 'true' : false
            };

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

                var onChange = getOnChange(element, $bodyElement, options);
                var scrolling = new Scrolling($document, $scrollableElement, options, onChange);

                handle = throttle(angular.bind(scrolling, scrolling.handle), 50);

                handle();

                $el = angular.element($scrollableElement).on('scroll', handle);
            };

            scope.$watch(function () {
                return scope.scrollerSelector;
            }, init);

            scope.$on('destroy', destroy);
        }

        function getOnChange(element, $bodyElement, options) {
            return function change(hidden) {
                element.toggleClass(options.cssClassHidden, hidden);
                $bodyElement.toggleClass(options.bodyCssClassHidden, hidden);
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

        atBottom: function () /* boolean */ {
            return (this.current + this.wHeight) >= this.dHeight;
        },

        down: function () /* boolean */ {
            return this.diff < 0;
        },

        handle: function () /* void */ {
            var hidden = false;
            var scrolling = this.update();
            if (this.current >= 1) {
                if (scrolling.down()) {
                    if (this.options.showAtBottom) {
                        var bottom = scrolling.atBottom();
                        hidden = !bottom;
                    } else {
                        hidden = true;
                    }
                }
            }

            this.change(hidden);
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

}(angular);