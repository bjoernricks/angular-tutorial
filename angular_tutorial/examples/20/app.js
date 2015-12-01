angular.module('nameApp', [])
    .filter('name', nameFilter)
    .controller('ExampleCtrl', ExampleCtrl);

function ExampleCtrl() {
    var ctrl = this;
    ctrl.names = ['Larry', 'Curly', 'Moe', 'John', 'Kelly', 'Thomas'];
    ctrl.name = '';
}

function nameFilter() {
    function truncate(values, name) {
        if (!name) {
            return values;
        }

        var out = [];
        angular.forEach(values, function(value) {
            if (value.indexOf(name) !== -1) {
                out.push(value);
            }
        });
        return out;
    }

    return truncate;
}
