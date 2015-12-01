angular.module('nameApp', [])
    .controller('NameCtrl', NameCtrl);


NameCtrl.$inject = ['$scope', '$timeout'];

function NameCtrl($scope, $timeout) {
    $scope.firstName = 'John';
    $scope.lastName = 'Doe';

    $scope.$watch('lastName', function(newValue, oldValue) {
        console.log('new value is ' + newValue);
    });

    $timeout(function() {
        $scope.lastName = 'Smith';
    }, 1000);
}
