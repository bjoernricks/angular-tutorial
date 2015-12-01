angular.module('nameApp', [])
    .controller('NameCtrl', NameCtrl);


NameCtrl.$inject = ['$log', '$scope', '$timeout'];

function NameCtrl(l, s, t) {
    s.firstName = 'John';
    s.lastName = 'Doe';

    s.$watch('lastName', function(newValue, oldValue) {
        l.debug('new value is ', newValue);
    });

    t(function() {
        s.lastName = 'Smith';
    }, 1000);
}
