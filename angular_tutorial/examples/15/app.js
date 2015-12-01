angular.module('nameApp', [])
    .controller('NameCtrl', NameCtrl);


NameCtrl.$inject = ['$log'];

function NameCtrl($log, $timeout) {
    var ctrl = this;

    ctrl.firstName = 'John';
    ctrl.lastName = 'Doe';
    ctrl.changeName = change_name;

    function change_name() {
        $log.debug('Changing lastname to Smith');
        ctrl.lastName = 'Smith';
    }
}
