/*
 * Copyright 2014 - 2015 Björn Ricks <bjoern.ricks@gmail.com>
 *
 */
(function() {
    'use strict';

    angular.module('angTutApp',
        ['ui.router', 'ngMaterial', 'angTutApp.controllers']
    )
    .config(app_config)
    .factory('conf', conf)
    .factory('examplesService', examplesService)
    .factory('menu', menu)
    .directive('hl', hl)
    .directive('atHljs', at_hljs);

    app_config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function app_config($stateProvider, $urlRouterProvider) {
        $stateProvider.
            state('base', {
                    templateUrl: 'base.html',
                    abstract: true,
                    controller: 'BaseCtrl',
                    controllerAs: 'base',
            }).
            state('home', {
                    url: '/',
                    parent: 'base',
                    templateUrl: 'home.html',
                    controller: 'HomeCtrl',
            }).
            state('example', {
                    parent: 'base',
                    url: '/examples/:exampleNumber',
                    templateUrl: 'example-view.html',
                    controller: 'ExampleDetailCtrl',
                    controllerAs: 'ctrl',
            }).
            state('section', {
                    parent: 'base',
                    url: '/sections/:sectionNumber',
                    templateUrl: 'section-view.html',
                    controller: 'SectionCtrl',
                    controllerAs: 'ctrl',
            });
        $urlRouterProvider.otherwise('/');
    }

    function conf() {
        var service = {
            examplesPath: 'examples/',
        };
        return service;
    }

    examplesService.$inject = ['$http', '$q', '$state'];

    function examplesService($http, $q, $state) {

        var section = null;
        var example = null;
        var examples = null;

        var service = {
            get: get_examples,
            setSection: set_section,
            setExample: set_example,
            getNext: get_next,
            hasNext: has_next,
            hasPrevious: has_previous,
            getPrevious: get_previous,
        };

        return service;

        function set_section(sectionid) {
            return get_examples().then(function(data) {
                for(var i=0; i < data.length; i++) {
                    var sec = data[i];
                    if (sec.id == sectionid) {
                        section = sec;
                        example = null;
                        return section;
                    }
                }
            });
        }

        function set_example(exampleid) {
            return get_examples().then(function(data) {
                for(var i=0; i < data.length; i++) {
                    var sec = data[i];
                    for(var j=0; j < sec.examples.length; j++) {
                        var ex = sec.examples[j];
                        if (ex.id == exampleid) {
                            section = sec;
                            example = ex;
                            return example;
                        }
                    }
                }
            });
        }

        function get_examples() {
            var deferred = $q.defer();

            if (examples !== null) {
                deferred.resolve(examples);
            }
            else {
                $http.get('examples.json', {cache: true}).then(
                    function(response) {
                        set_examples(response.data);
                        deferred.resolve(examples);
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );
            }

            return deferred.promise;
        }

        function get_next() {
            if (angular.isObject(example)) {
                if (angular.isObject(example.next)) {
                    return $state.href('example', {exampleNumber: example.next.id});
                }
                if (angular.isObject(section) && angular.isObject(section.next)) {
                    return $state.href('section', {sectionNumber: section.next.id});
                }
            }

            if (angular.isObject(section)) {
                if (section.examples.length > 0) {
                    return $state.href('example', {exampleNumber: section.examples[0].id});
                }
                if (angular.isObject(section.next)) {
                    return $state.href('section', {sectionNumber: section.next.id});
                }
            }

            return "#/";
        }

        function get_previous() {
            if (angular.isObject(example)) {
                if (angular.isObject(example.prev)) {
                    return $state.href('example', {exampleNumber: example.prev.id});
                }
                if (angular.isObject(section) && angular.isObject(section.prev)) {
                    return $state.href('section', {sectionNumber: section.prev.id});
                }
            }

            if (angular.isObject(section) && angular.isObject(section.prev)) {
                var nr = section.prev.examples.length - 1;
                if (nr > 0) {
                    return $state.href('example', {exampleNumber: section.prev.examples[nr].id});
                }
                return $state.href('section', {sectionNumber: section.prev.id});
            }

            return "#/";
        }

        function has_next() {
            return (angular.isObject(example) && angular.isObject(example.next)) ||
                (angular.isObject(section) && angular.isObject(section.next));
        }

        function has_previous() {
            return angular.isObject(section) && angular.isObject(example);
        }

        function set_examples(data) {
            var secprev = null;
            for (var i=0; i < data.length; i++) {
                var sec = data[i];

                sec.prev = secprev;
                if (angular.isObject(secprev)) {
                    secprev.next = sec;
                }
                secprev = sec;

                var exprev = null;
                for (var j=0; j < sec.examples.length; j++) {
                    var ex = sec.examples[j];
                    ex.prev = exprev;
                    ex.section = sec;
                    if (angular.isObject(exprev)) {
                        exprev.next = ex;
                    }
                    exprev = ex;
                }
            }
            examples = data;
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
            isSectionSelected: is_section_selected,
            getSectionName: get_section_name,
            setSelectSection: function(section) {
                openedsection = section;
            }
        };
        return service;

        function is_section_selected(section) {
            return angular.isObject(openedsection) && openedsection.id === section.id;
        }

        function get_section_name() {
            if (!openedsection) {
                return "";
            }
            return openedsection.name;
        }
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
