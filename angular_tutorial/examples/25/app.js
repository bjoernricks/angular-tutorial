angular.module('nameApp', [])
    .factory('NamesService', namesService)
    .directive('name', nameDirective)
    .controller('ExampleCtrl', ExampleCtrl);

ExampleCtrl.$inject = ['NamesService'];

function ExampleCtrl(NamesService) {
    var ctrl = this;
    NamesService.getNames(function(data) {
        ctrl.names = data;
    });
}

namesService.$inject = ['$http'];

function namesService($http) {
    var service = {
        getNames: get_names,
    };
    return service;

    function get_names(callback) {
        $http.get('/examples/23/names.json').then(function(response) {
            callback(response.data);
        });
    }
}

function nameDirective() {
    return {
        restrict: 'AE',
        templateUrl: '/examples/25/name.html'
    };
}
