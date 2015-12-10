/*
 * Copyright 2014 - 2015 Björn Ricks <bjoern.ricks@gmail.com>
 *
 */
(function() {
    'use strict';

    angular.module('angTutApp.controllers',
        ['ui.router', 'ngMaterial']
    )
    .controller('HomeCtrl', home_ctrl)
    .controller('SectionCtrl', section_ctrl)
    .controller('ExampleDetailCtrl', example_detail_ctrl);

    home_ctrl.$inject = ['$scope', 'examplesService', 'menu'];

    function home_ctrl($scope, examplesService, menu) {
        $scope.menu = menu;
        examplesService.get().then(function(examples) {
            $scope.examples = examples;
        });
    }

    example_detail_ctrl.$inject = ['$stateParams', '$http', '$sce', 'conf', 'examplesService',
        'menu'];

    function example_detail_ctrl($stateParams, $http, $sce, conf, examplesService, menu) {
        var ctrl = this;
        ctrl.menu = menu;
        examplesService.setExample($stateParams.exampleNumber).then(function(example) {
            var examplePath = conf.examplesPath + example.id + '/';
            ctrl.example = example;
            ctrl.runUrl = examplePath + 'index.html';
            ctrl.readme = examplePath + 'readme.html';
            ctrl.next = examplesService.getNext();
            ctrl.hasNext = examplesService.hasNext();
            ctrl.previous = examplesService.getPrevious();
            ctrl.hasPrevious = examplesService.hasPrevious();
            menu.setSelectSection(example.section);
        });

    }


    section_ctrl = ['$scope', '$stateParams', '$http', '$sce', 'conf', 'examplesService', 'menu'];

    function section_ctrl($scope, $stateParams, $http, $sce, conf, examplesService, menu) {
        $scope.menu = menu;
        examplesService.setSection($stateParams.sectionNumber).then(function(section) {
            $scope.section = section;
            $scope.readme = conf.examplesPath + 'section' + section.id + '.html';
            $scope.next = examplesService.getNext();
            $scope.hasNext = examplesService.hasNext();
            $scope.previous = examplesService.getPrevious();
            $scope.hasPrevious = examplesService.hasPrevious();
            menu.setSelectSection(section);
        });
    }
})();
