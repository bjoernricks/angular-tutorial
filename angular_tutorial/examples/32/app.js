angular.module('nameApp',
    [
        'ngRoute',
        'nameApp.controllers'
    ])
    .factory('PersonsService', personsService)
    .config(configRoutes);

personsService.$inject = ['$http'];

function personsService($http) {
    var service = {
        getAll: get_all,
        get: get,
    };
    return service;

    function get_all() {
        return $http.get('names.json').then(function(response) {
            return response.data;
        });
    }

    function get(id) {
        return $http.get('names.json').then(function(response) {
            for(var i=0; i < response.data.length; i++) {
                var data = response.data[i];
                if (data.id == id) {
                    return data;
                }
            }
        });
    }
}

configRoutes.$inject = ['$routeProvider'];

function configRoutes($routeProvider) {
    $routeProvider
        .when('/', {
                templateUrl: 'list.html',
                controller: 'ExampleCtrl',
                controllerAs: 'ctrl',
        })
        .when('/:id', {
                templateUrl: 'detail.html',
                controller: 'ExampleDetailCtrl',
                controllerAs: 'ctrl',
        })
        .otherwise({
            redirectTo: '/'
        });
}
