angular.module('nameApp', [])
    .factory('NamesService', namesService)
    .controller('ExampleCtrl', ExampleCtrl);

ExampleCtrl.$inject = ['NamesService'];

function ExampleCtrl(NamesService) {
    var ctrl = this;
    ctrl.names = NamesService.getNames();
    ctrl.getNames = NamesService.getNames;
}

function namesService() {
    var names = ['Larry', 'Curly', 'Moe', 'John', 'Kelly', 'Thomas'];

    var service = {
        getNames: get_names,
    };
    return service;

    function get_names() {
        return names;
    }
}
