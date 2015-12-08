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

    ctrl.remove = function(pers) {
        ctrl.persons = ctrl.persons.filter(function(p) {
            if (p !== pers) {
                return true;
            }
            return false;
        });
    };
}

personsService.$inject = ['$http'];

function personsService($http) {
    var service = {
        get: get_all,
    };
    return service;

    function get_all(callback) {
        $http.get('/examples/30/names.json').then(function(response) {
            callback(response.data);
        });
    }
}

function NameDirectiveCtrl() {
}

function nameDirective() {
    return {
        restrict: 'AE',
        templateUrl: '/examples/30/name.html',
        controller: NameDirectiveCtrl,
        scope: {
            person: '=',
            onDelete: '&',
        },
    };


}
