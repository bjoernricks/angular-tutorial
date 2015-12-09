angular.module('nameApp',
    [
        'ui.router',
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

configRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

function configRoutes($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('list', {
                url: '/',
                templateUrl: 'list.html',
                controller: 'ExampleCtrl',
                controllerAs: 'ctrl',
        })
        .state('detail', {
                url: '/:id',
                templateUrl: 'detail.html',
                controller: 'ExampleDetailCtrl',
                controllerAs: 'ctrl',
        });
}
