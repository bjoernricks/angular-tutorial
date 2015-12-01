angular.module('nameApp', [])
    .controller('NameCtrl', NameCtrl);

function NameCtrl() {
    var ctrl = this;
    ctrl.names = ['Larry', 'Curly', 'Moe'];
    ctrl.name = 'John';
    ctrl.addName = add_name;

    function add_name() {
        ctrl.names.push(ctrl.name);
    }
}
