/*
 * Copyright 2014 - 2015 Björn Ricks <bjoern.ricks@gmail.com>
 *
 */
(function() {
    'use strict';

    angular.module('angTutApp',
        ['ui.router', 'ngMaterial']
    )
    .config(app_config)
    .factory('conf', conf)
    .factory('examples', examples)
    .factory('menu', menu)
    .directive('hl', hl)
    .directive('atHljs', at_hljs)
    .controller('HomeCtrl', home_ctrl)
    .controller('SectionCtrl', section_ctrl)
    .controller('ExampleDetailCtrl', example_detail_ctrl);

    app_config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function app_config($stateProvider, $urlRouterProvider) {
        $stateProvider.
            state('home', {
                    url: '/',
                    templateUrl: 'home.html'
            }).
            state('example', {
                    url: '/examples/:exampleNumber',
                    templateUrl: 'example-view.html',
                    controller: 'ExampleDetailCtrl'
            }).
            state('section', {
                    url: '/sections/:sectionNumber',
                    templateUrl: 'section-view.html',
                    controller: 'SectionCtrl'
            });
        $urlRouterProvider.otherwise('/');
    }

    function conf() {
        var service = {
            examplesPath: 'examples/',
        };
        return service;
    }


    examples.$inject = ['$http'];

    function examples($http) {
        var service = {
            list: get_data,
            find: find,
            findSection: find_section,
            findSectionFromExample: find_section_from_example,
        };

        return service;

        function get_data(callback) {
            $http({
                method: 'GET',
                url: 'examples.json',
                cache: true
            }).success(callback);
        }

        function find(exampleNumber, callback) {
            get_data(function(data) {
                var index = parseInt(exampleNumber);
                angular.forEach(data, function(section, key) {
                    angular.forEach(section.examples, function(example, key) {
                        if (example.id == index) {
                            callback(example);
                        }
                    });
                });
            });
        }

        function find_section(sectionNumber, callback) {
            get_data(function(data) {
                var index = parseInt(sectionNumber);
                angular.forEach(data, function(section, key) {
                    if (section.id == index) {
                        callback(section);
                    }
                });
            });
        }

        function find_section_from_example(exampleNumber, callback) {
            get_data(function(data) {
                var index = parseInt(exampleNumber);
                angular.forEach(data, function(section, key) {
                    angular.forEach(section.examples, function(example, key) {
                        if (example.id == index) {
                            callback(section);
                        }
                    });
                });
            });
        }
    }


    function menu() {
        var openedsection = null;
        var service = {
            selectSection: function(section) {
                openedsection = section;
            },
            toggleSelectSection: function(section) {
                openedsection = (openedsection === section ? null : section);
            },
            isSectionSelected: function(section) {
                return openedsection !== null && openedsection.id === section.id;
            },
            getSectionName: function() {
                if (!openedsection) {
                    return "";
                }
                return openedsection.name;
            },
            setSelectSection: function(section) {
                openedsection = section;
            }
        };
        return service;
    }


    home_ctrl.$inject = ['$scope', 'examples', 'menu'];

    function home_ctrl($scope, examples, menu) {
        $scope.menu = menu;
        examples.list(function(examples) {
            $scope.examples = examples;
        });
    }


    example_detail_ctrl.$inject = ['$scope', '$stateParams', '$http', '$sce', 'conf',
        'examples', 'menu'];

    function example_detail_ctrl($scope, $stateParams, $http, $sce, conf, examples, menu) {
        $scope.menu = menu;
        examples.find($stateParams.exampleNumber, function(example) {
            $scope.example = example;
            var examplePath = conf.examplesPath + example.id + '/';
            $scope.runUrl = examplePath + 'index.html';
            $scope.readme = examplePath + 'readme.html';
        });

        examples.findSectionFromExample($stateParams.exampleNumber, function(section) {
            menu.setSelectSection(section);
        });
    }


    section_ctrl = ['$scope', '$stateParams', '$http', '$sce', 'conf', 'examples', 'menu'];

    function section_ctrl($scope, $stateParams, $http, $sce, conf, examples, menu) {
        $scope.menu = menu;
        examples.findSection($stateParams.sectionNumber, function(section) {
            $scope.section = section;
            $scope.readme = conf.examplesPath + 'section' + section.id + '.html';
        });
    }


    at_hljs.$inject = ['conf'];

    function at_hljs(conf) {
        return {
            scope: { file: '=', example: '=' },
            restrict: 'A',
            controller: function($scope, $http) {
                var path = [
                    conf.examplesPath,
                    $scope.example.id,
                    $scope.file
                ].join('/');
                $http.get(path).success(function(data) {
                    if (typeof(data) === 'object') {
                        // un-parse auto-parsed JSON files for presentation as text
                        data = JSON.stringify(data, null, 2);
                    } else {
                        // Remove trailing newlines from code presentation
                        data = data.trim();
                    }
                    $scope.content = data;
                });
            },
            link: function(scope, element, attrs) {
                var contentParent = angular.element(
                    '<pre><code class="highlight" ng-non-bindable></code></pre>'
                );
                element.append(contentParent);
                scope.$watch('content', function(data) {
                    if (data) {
                        var codeElement = contentParent.find('code');
                        var highlightedCode = hljs.highlightAuto(data);
                        codeElement.append(
                            highlightedCode.value).addClass('highlight');
                    }
                });
            }
        };
    }

    function hl() {
        var directive = {
            restrict: 'A',
            link: link,
        };
        return directive;

        function link(scope, element, attrs) {
            var d = element.html();
            var contentParent = angular.element(
                '<pre><code class="highlight" ng-non-bindable></code></pre>'
            );
            var codeElement = contentParent.find('code');

            element.empty();
            element.append(contentParent);

            var language = element.attr('hl');
            var highlightedCode;
            if (language) {
                highlightedCode = hljs.highlightAuto(d, [language]);
            }
            else {
                highlightedCode = hljs.highlightAuto(d);
            }
            codeElement.html(highlightedCode.value);
        }
    }
})();
