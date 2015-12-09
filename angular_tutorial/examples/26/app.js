angular.module('nameApp', [])
    .factory('PersonsService', personsService)
    .directive('name', nameDirective)
    .controller('ExampleCtrl', ExampleCtrl);

ExampleCtrl.$inject = ['PersonsService'];

function ExampleCtrl(PersonsService) {
    var ctrl = this;
    PersonsService.get(function(data) {
        ctrl.persons = data;
    });
}

personsService.$inject = ['$http'];

function personsService($http) {
    var service = {
        get: get_all,
    };
    return service;

    function get_all(callback) {
        $http.get('/examples/26/names.json').then(function(response) {
            callback(response.data);
        });
    }
}

function nameDirective() {
    return {
        restrict: 'AE',
        templateUrl: '/examples/26/name.html'
    };
}
