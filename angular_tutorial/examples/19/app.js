angular.module('nameApp', [])
    .filter('truncate', truncateFilter)
    .controller('ExampleCtrl', ExampleCtrl);

function ExampleCtrl() {
    var ctrl = this;
    ctrl.text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ' +
        'eirmod tempor invidunt ut labore et dolore magna aliquyam';
    ctrl.max = 40;
}

function truncateFilter() {
    function truncate(value, max) {
        max = max ? max : 20;
        var out = value;
        if (out.length > max) {
            out = out.substr(0, max) + ' ...';
        }
        return out;
    }

    return truncate;
}
