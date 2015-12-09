angular.module('nameApp.controllers', [])
    .controller('ExampleDetailCtrl', ExampleDetailCtrl)
    .controller('ExampleCtrl', ExampleCtrl);

ExampleCtrl.$inject = ['PersonsService'];

function ExampleCtrl(PersonsService) {
    var ctrl = this;

    PersonsService.getAll().then(function(data) {
        ctrl.persons = data;
    });
}

ExampleDetailCtrl.$inject = ['$routeParams', 'PersonsService'];

function ExampleDetailCtrl($routeParams, PersonsService) {
    var ctrl = this;

    PersonsService.get($routeParams.id).then(function(data) {
        ctrl.person = data;
    });
}

