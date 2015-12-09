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

ExampleDetailCtrl.$inject = ['$stateParams', 'PersonsService'];

function ExampleDetailCtrl($stateParams, PersonsService) {
    var ctrl = this;

    PersonsService.get($stateParams.id).then(function(data) {
        ctrl.person = data;
    });
}

