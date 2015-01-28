var angTutApp = angular.module('angTutApp', ['ngRoute', 'ngMaterial']);

angTutApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'html/home.html'
            }).
            when('/examples/:exampleNumber', {
                templateUrl: 'html/example-view.html',
                controller: 'ExampleDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]
);

angTutApp.factory('examples', function($http) {
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
        }
    };
});

angTutApp.factory('menu', function() {
    return self = {
        selectSection: function(section) {
            self.openedSection = section;
        },
        toggleSelectSection: function(section) {
            self.openedSection = (self.openedSection === section ?
                    null : section);
        },
        isSectionSelected: function(section) {
            return self.openedSection === section;
        }
    };
});

angTutApp.controller('HomeCtrl', function($scope, examples, menu) {
    $scope.menu = menu;
    examples.list(function(examples) {
        $scope.examples = examples;
    });
});

angTutApp.controller('ExampleDetailCtrl',
    function($scope, $routeParams, $http, $sce, examples, menu) {
        $scope.menu = menu;
        examples.find($routeParams.exampleNumber, function(example) {
            $scope.example = example;
            var examplePath = '' + example.id;
            $scope.runUrl = examplePath + '/index.html';
            $scope.readme = examplePath + '/readme.html';
        });
    });

angTutApp.directive('atHljs', function() {
    return {
        scope: { file: '=', example: '=' },
        restrict: 'A',
        controller: function($scope, $http) {
            var path = [
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
});
