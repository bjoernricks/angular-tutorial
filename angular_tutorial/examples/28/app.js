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
    ctrl.max = 4;
}

personsService.$inject = ['$http'];

function personsService($http) {
    var service = {
        get: get_all,
    };
    return service;

    function get_all(callback) {
        $http.get('/examples/28/names.json').then(function(response) {
            callback(response.data);
        });
    }
}

NameDirectiveCtrl.$inject = ['$scope'];

function NameDirectiveCtrl($scope) {
    $scope.ctrl.max = 5; // undefined
    $scope.remove = function(person) {
        $scope.ctrl.persons = $scope.ctrl.persons.filter(function(p) {
            if (p !== person) {
                return true;
            }
            return false;
        });
    };
}

function nameDirective() {
    return {
        restrict: 'AE',
        templateUrl: '/examples/28/name.html',
        controller: NameDirectiveCtrl,
        scope: {},
    };


}
