/*
 * Copyright 2014 - 2015 Björn Ricks <bjoern.ricks@gmail.com>
 *
 */
(function() {
    'use strict';

    angular.module('angTutApp.controllers',
        ['ui.router', 'ngMaterial']
    )
    .controller('BaseCtrl', BaseCtrl)
    .controller('HomeCtrl', HomeCtrl)
    .controller('SectionCtrl', SectionCtrl)
    .controller('ExampleDetailCtrl', ExampleDetailCtrl);

    HomeCtrl.$inject = ['menu'];

    function HomeCtrl(menu) {
        var ctrl = this;
    }

    BaseCtrl.$inject = ['menu', 'examplesService'];

    function BaseCtrl(menu, examplesService) {
        var ctrl = this;
        ctrl.menu = menu;
        examplesService.get().then(function(examples) {
            ctrl.sections = examples;
        });
    }

    ExampleDetailCtrl.$inject = ['$stateParams', '$http', '$sce', 'conf', 'examplesService',
        'menu'];

    function ExampleDetailCtrl($stateParams, $http, $sce, conf, examplesService, menu) {
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
            menu.selectSection(example.section);
        });

    }


    SectionCtrl = ['$stateParams', '$http', '$sce', 'conf', 'examplesService', 'menu'];

    function SectionCtrl($stateParams, $http, $sce, conf, examplesService, menu) {
        var ctrl = this;
        ctrl.menu = menu;
        examplesService.setSection($stateParams.sectionNumber).then(function(section) {
            ctrl.section = section;
            ctrl.readme = conf.examplesPath + 'section' + section.id + '.html';
            ctrl.next = examplesService.getNext();
            ctrl.hasNext = examplesService.hasNext();
            ctrl.previous = examplesService.getPrevious();
            ctrl.hasPrevious = examplesService.hasPrevious();
            menu.selectSection(section);
        });
    }
})();
