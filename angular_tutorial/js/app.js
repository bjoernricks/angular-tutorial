/*
 * Copyright 2015 Björn Ricks <bjoern.ricks@gmail.com>
 *
 */
(function() {
    'use strict';

    angular.module('angTutApp',
        ['ngRoute', 'ngMaterial']
    )
    .config(app_config)
    .factory('conf', conf)
    .factory('examples', examples)
    .factory('menu', menu)
    .directive('atHljs', at_hljs)
    .controller('HomeCtrl', home_ctrl)
    .controller('SectionCtrl', section_ctrl)
    .controller('ExampleDetailCtrl', example_detail_ctrl);

    app_config.$inject = ['$routeProvider'];

    function app_config($routeProvider) {
        $routeProvider.
        when('/', {
                templateUrl: 'home.html'
        }).
        when('/examples/:exampleNumber', {
                templateUrl: 'example-view.html',
                controller: 'ExampleDetailCtrl'
        }).
        when('/sections/:sectionNumber', {
                templateUrl: 'section-view.html',
                controller: 'SectionCtrl'
        }).
        otherwise({
                redirectTo: '/'
        });
    }

    function conf() {
        var service = {
            examplesPath: 'examples/',
        };
        return service;
    }


    examples.$inject = ['$http'];

    function examples($http) {
        function getData(callback) {
            $http({
                method: 'GET',
                url: 'examples.json',
                cache: true
            }).success(callback);
        }
        return {
            list: getData,
            find: function(exampleNumber, callback) {
                getData(function(data) {
                    var index = parseInt(exampleNumber);
                    angular.forEach(data, function(section, key) {
                        angular.forEach(section.examples, function(example, key) {
                            if (example.id == index) {
                                callback(example);
                            }
                        });
                    });
                });
            },
            findSection: function(sectionNumber, callback) {
                getData(function(data) {
                    var index = parseInt(sectionNumber);
                    angular.forEach(data, function(section, key) {
                        if (section.id == index) {
                            callback(section);
                        }
                    });
                });
            }
        };
    }


    function menu() {
        return {
            selectSection: function(section) {
                self.openedSection = section;
            },
            toggleSelectSection: function(section) {
                self.openedSection = (self.openedSection === section ?
                        null : section);
            },
            isSectionSelected: function(section) {
                return self.openedSection === section;
            },
            getSectionName: function() {
                if (!self.openedSection) {
                    return "";
                }
                return self.openedSection.name;
            }
        };
    }


    home_ctrl.$inject = ['$scope', 'examples', 'menu'];

    function home_ctrl($scope, examples, menu) {
        $scope.menu = menu;
        examples.list(function(examples) {
            $scope.examples = examples;
        });
    }


    example_detail_ctrl.$inject = ['$scope', '$routeParams', '$http', '$sce', 'conf',
        'examples', 'menu'];

    function example_detail_ctrl($scope, $routeParams, $http, $sce, conf, examples, menu) {
        $scope.menu = menu;
        examples.find($routeParams.exampleNumber, function(example) {
            $scope.example = example;
            var examplePath = conf.examplesPath + example.id + '/';
            $scope.runUrl = examplePath + 'index.html';
            $scope.readme = examplePath + 'readme.html';
        });
    }


    section_ctrl = ['$scope', '$routeParams', '$http', '$sce', 'conf', 'examples', 'menu'];

    function section_ctrl($scope, $routeParams, $http, $sce, conf, examples, menu) {
        $scope.menu = menu;
        examples.findSection($routeParams.sectionNumber, function(section) {
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
})();
