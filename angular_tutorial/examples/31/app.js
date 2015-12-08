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

    ctrl.remove = function(person) {
        ctrl.persons = ctrl.persons.filter(function(p) {
            if (p !== person) {
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
        $http.get('/examples/31/names.json').then(function(response) {
            callback(response.data);
        });
    }
}

function NameDirectiveCtrl() {
}

function nameDirective() {
    return {
        restrict: 'AE',
        templateUrl: '/examples/31/name.html',
        controller: NameDirectiveCtrl,
        controllerAs: 'ctrl',
        scope: {},
        bindToController: {
            person: '=',
            onDelete: '&',
        },
    };


}
