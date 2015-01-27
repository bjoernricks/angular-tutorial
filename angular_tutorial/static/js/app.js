var angTutApp = angular.module('angTutApp', ['ngRoute', 'ngMaterial']);

angTutApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'html/home.html'
            }).
            when('/:exampleNumber', {
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
            url: 'static/examples.json',
            cache: true
        }).success(callback);
    }
    return {
        list: getData,
        find: function(exampleNumber, callback) {
            getData(function(data) {
                var index = parseInt(exampleNumber) - 1;
                callback(data[index]);
            });
        }
    };
});

angTutApp.controller('HomeCtrl', function($scope, examples) {
    examples.list(function(examples) {
        $scope.examples = examples;
    });
});

angTutApp.controller('ExampleDetailCtrl',
    function($scope, $routeParams, $http, $sce, examples) {
        examples.find($routeParams.exampleNumber, function(example) {
            $scope.example = example;
            var examplePath = 'examples/' + example.id;
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
                'examples/',
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
