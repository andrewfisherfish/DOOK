/**
 * Created by andre on 11/22/2015.
 */
(function (angular, document, _) {
    var module = angular.module('DOOK.Book', [
        'DOOK.UI',
        'DOOK.DTO',
        'DOOK.Utils',
        'angular.filter',
        'ngTouch'
    ]);

    module.config(['$provide', function ($provide) {
        module.$provide = $provide;
    }]);

    module.value('fakeData', window.fakeData);

    module.run(['$rootScope', '$filter', 'uiState', 'loremIpsumService',
        function ($rootScope, $filter, uiState, loremIpsumService) {
            $rootScope.uiState = uiState;

            var openText = function () {
                return loremIpsumService.get().then(function (data) {
                    $rootScope.loremIpsum = data;
                    $rootScope.loremIpsumReady = true;
                    return data;
                });
            };

            $rootScope.openText = openText;
        }
    ]);

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

    }]);

    module.directive('modal', [function () {
        return {
            restrict: 'C',
            scope: false,
            controller: ['$element', '$scope', function ($element, $scope) {
                _.extend(this, {
                    $scope: $scope,
                    $element: $element,
                    scrollTop: function () {
                        $element[0].scrollTop = 0;
                    }
                });
            }]
        }
    }]);

    module.directive('bookReaderParent', [
        'loremIpsumService', '$compile', '$window', '$uibModal',
        function (loremIpsumService, $compile, $window, $uibModal) {
            return {
                restrict: 'A',
                controller: ['$element', '$scope', '$filter', function ($element, $scope, $filter) {
                    var self = this;
                    this.minimized = [];
                    this.questions = [];
                    var cutOffCircles = function () {
                        var totLen = $filter('activeQuestionsLength')(self.questions) > 0 ? (self.minimized.length + 1) : self.minimized.length;

                        var cutOffLen = totLen - Math.floor($window.innerWidth / 65) + 1;

                        if (cutOffLen > 0) {
                            self.minimized.splice(0, cutOffLen);
                        }
                    };
                    this.questionPush = function (data) {
                        var index = _.findIndex(self.questions, function (o) {
                            return o.questionPhrase === data.questionPhrase;
                        });

                        if (index > -1) {
                            return;
                        }

                        self.questions.push(data);

                        cutOffCircles();
                    };
                    this.minimizedPush = function (data) {
                        var index = _.findIndex(self.minimized, function (o) {
                            return o.tagPhrase === data.tagPhrase;
                        });

                        if (index > -1) {
                            self.minimized.splice(index, 1);
                        }

                        cutOffCircles();

                        self.minimized.push(data);
                    };
                    this.open = function () {
                        throw new Error('text container is not initialized yet');
                    };

                    this.openQuestionDialog = function (all) {
                        $uibModal.open({
                            animation: true,
                            templateUrl: '/bookApp/views/modal-question-context-menu.html',
                            controller: ['$scope', '$uibModalInstance', 'questions', 'helper',
                                function ($scope, $uibModalInstance, questions, helper) {
                                    $scope.answersArray = helper.randomArray(2, 6);
                                    $scope.total = questions.length;
                                    $scope.index = questions.length - 1;

                                    var answer = function () {
                                        if (questions.length > 0) {
                                            var q = _.find(questions, function (q) {
                                                return q.answered !== true;
                                            });

                                            if (q) {
                                                q.answered = true;
                                            }
                                        }
                                    };

                                    var reload = function () {
                                        $scope.answersArray = helper.randomArray(2, 6);
                                        $scope.$broadcast('reload');
                                    };

                                    $scope.prev = function () {
                                        $scope.index--;
                                        if ($scope.index < 0) {
                                            $scope.index++;
                                            return;
                                        }
                                        reload();
                                    };

                                    $scope.next = function () {
                                        $scope.index++;
                                        if ($scope.index >= questions.length) {
                                            $scope.index--;
                                            return;
                                        }
                                        reload();
                                    };

                                    $scope.answer = function () {
                                        answer();
                                        $scope.next();
                                    };

                                    $scope.dismiss = function () {
                                        $uibModalInstance.dismiss('cancel');
                                    };
                                }
                            ],
                            resolve: {
                                questions: [function () {
                                    if (all)
                                        return self.questions;
                                    else
                                        return $filter('activeQuestions')(self.questions);
                                }]
                            },
                            size: 'sm',
                            windowClass: 'quick-menu'
                        });
                    };
                }]
            }
        }
    ]);

    module.filter('activeQuestions', [function () {
        return function (questions) {
            return _.filter(questions, function (q) {
                return q.answered != true;
            });
        }
    }]);

    module.filter('activeQuestionsLength', [function () {
        return function (questions) {
            return _.filter(questions, function (q) {
                return q.answered != true;
            }).length;
        }
    }]);

    module.directive('bookReaderFooter', ['loremIpsumService', '$compile', '$window', '$uibModal',
        function (loremIpsumService, $compile, $window, $uibModal) {
            return {
                restrict: 'A',
                require: '^bookReaderParent',
                link: function (scope, element, attr, ctrl) {
                    scope.openQuestionDialog = ctrl.openQuestionDialog;

                    scope.$watchCollection(function () {
                        return {
                            questions: ctrl.questions,
                            minimized: ctrl.minimized
                        };
                    }, function (o) {
                        _.extend(scope, o);
                    });

                    scope.remove = function (item, $index) {
                        ctrl.minimized.splice($index, 1);
                    };
                }
            }
        }
    ]);

    module.directive('randomBackgroundColor', ['helper', function (helper) {
        return function (scope, element, attr) {
            element.css('background-color', 'rgba(' + helper.randomInt(0, 255) + ',' + helper.randomInt(0, 255) + ',' + helper.randomInt(0, 255) + ',0.8)');
        }
    }]);

    module.directive('bookReaderText', ['loremIpsumService', '$compile', '$window', 'uiState',
        function (loremIpsumService, $compile, $window, uiState) {
            var fillData = function (scope, element, attr, ctrl) {
                return loremIpsumService.get().then(function (data) {
                    element.html(data);
                    $compile(element.contents())(scope);
                    return data;
                }).then(function () {
                    $window.scrollTo(0, 0);
                });
            };
            return {
                restrict: 'A',
                require: '^bookReaderParent',
                link: function (scope, element, attr, ctrl) {
                    fillData(scope, element);
                    ctrl.open = function () {
                        uiState.switchOff('isContents', 'isMenu', 'isSearch');
                        return fillData(scope, element);
                    };
                },
                controller: ['$element', '$scope', function ($element, $scope) {
                    fillData($scope, $element);
                }]
            }
        }
    ]);

    module.directive('preview', ['loremIpsumService', '$uibModal', '$compile', function (loremIpsumService, $uibModal, $compile) {
        return {
            require: ['?^modal', '?^bookReaderText', '^bookReaderParent'],
            scope: false,
            restrict: 'AE',
            link: function (scope, el, attr, ctrl) {
                var modalInstance;
                var modalCtrl = ctrl[0];
                var bookReaderTextCtrl = ctrl[1];
                var bookReaderParentCtrl = ctrl[2];
                var tagPhrase = attr.preview || el.html();

                var openHere = function () {
                    return loremIpsumService.get().then(function (data) {
                        scope.tagPhrase = tagPhrase;
                        scope.loremIpsum = data;
                    }).then(modalCtrl.scrollTop);
                };
                var openFromModal = function () {
                    modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/bookApp/views/modal-chapter-context-menu.html',
                        controller: ['$scope', '$uibModalInstance', 'loremIpsum',
                            function ($scope, $uibModalInstance, loremIpsum) {
                                _.extend($scope, {
                                    isModal: true,
                                    tagPhrase: tagPhrase,
                                    loremIpsum: loremIpsum,
                                    minimize: function () {
                                        bookReaderParentCtrl.minimizedPush({
                                            caption: tagPhrase.slice(0, 2),
                                            tagPhrase: tagPhrase
                                        });
                                        $uibModalInstance.dismiss();
                                    },
                                    open: function () {
                                        bookReaderParentCtrl.open()
                                            .then($uibModalInstance.dismiss);
                                    },
                                    cancel: function () {
                                        $uibModalInstance.dismiss('cancel');
                                    }
                                });
                            }
                        ],
                        resolve: {
                            loremIpsum: ['loremIpsumService', function (loremIpsumService) {
                                return loremIpsumService.get();
                            }]
                        },
                        windowClass: 'modal-preview'
                    });
                };

                el.bind('click', function () {
                    scope.$apply(scope.isModal ? openHere : openFromModal);
                });
            }
        }
    }]);

    module.directive('question', ['$window', function ($window) {
        return {
            require: ['?^bookReaderText', '^bookReaderParent'],
            scope: false,
            restrict: 'AE',
            link: function (scope, element, attr, ctrl) {
                var bookReaderTextCtrl = ctrl[0];
                var bookReaderParentCtrl = ctrl[1];
                var questionPhrase = attr.preview || element.html();

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

                    return (top + height) > window.pageYOffset &&
                        (left + width) > window.pageXOffset &&
                        top < (window.pageYOffset + window.innerHeight) &&
                        left < (window.pageXOffset + window.innerWidth);
                }

                var windowEl = angular.element($window);

                var handler = function () {
                    if (elementInViewport(element[0])) {
                        bookReaderParentCtrl.questionPush({
                            questionPhrase: questionPhrase
                        });
                    }
                };

                handler();
                windowEl.on('scroll', scope.$apply.bind(scope, handler));
            }
        }
    }]);

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

}(angular, document, _));