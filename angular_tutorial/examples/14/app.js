angular.module('nameApp', [])
    .controller('NameCtrl', NameCtrl);


NameCtrl.$inject = ['$log', '$timeout'];

function NameCtrl($log, $timeout) {
    var ctrl = this;

    ctrl.firstName = 'John';
    ctrl.lastName = 'Doe';

    $timeout(function() {
        $log.debug('Changing lastname to Smith');
        ctrl.lastName = 'Smith';
    }, 1000);
}
