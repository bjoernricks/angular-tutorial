angular.module('nameApp', [])
    .controller('ExampleCtrl', ExampleCtrl);

function ExampleCtrl() {
    var ctrl = this;
    ctrl.now = new Date();
}
