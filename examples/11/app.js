var nameApp = angular.module('nameApp', []);

nameApp.controller('NameCtrl', function($scope) {
    $scope.names = ['Larry', 'Curly', 'Moe'];
});
