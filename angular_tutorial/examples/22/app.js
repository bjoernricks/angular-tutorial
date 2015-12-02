angular.module('nameApp', [])
    .factory('NamesService', namesService)
    .controller('ExampleCtrl', ExampleCtrl);

ExampleCtrl.$inject = ['NamesService'];

function ExampleCtrl(NamesService) {
    var ctrl = this;
    NamesService.getNames(function(data) {
        ctrl.names = data;
    });
}

function namesService() {
    var names = ['Larry', 'Curly', 'Moe', 'John', 'Kelly', 'Thomas'];

    var service = {
        getNames: get_names,
    };
    return service;

    function get_names(callback) {
        callback(names);
    }
}
