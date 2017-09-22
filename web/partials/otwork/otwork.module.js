define([
    'angular',
    'angular-sanitize',
    'angular-cookies',
    'angular-bootstrap',
    'angular-ui-select',
    'boss.api'
], function(ng) {
    'use strict';

    var otModule = ng.module('boss.otwork', [
        'ngCookies',
        'ngSanitize',
        'ui.bootstrap',
        'ui.select',
        'boss.api'
    ]);

    otModule
        .config(['$controllerProvider', '$filterProvider', '$compileProvider',
            function($controllerProvider, $filterProvider, $compileProvider) {
                otModule.controller = $controllerProvider.register;
                otModule.directive = $compileProvider.directive;
                otModule.filter = $filterProvider.register;
            }
        ]);

    otModule
        .config(['$stateProvider',
            function($stateProvider) {

                // otwork
                $stateProvider.state({
                    abstract: true,
                    name: 'otwork',
                    url: '/otwork',
                    template: '<div ui-view />'
                });

            }
        ]);

    otModule.run(['$rootScope', '$mdDialog', function($rootScope, $mdDialog) {

        $rootScope.$on('BOSS_NEW_OTWORK', function(evt) {
            showOTWorkModify();
        });

        var showOTWorkModify = function() {
            $mdDialog.show({
                templateUrl: 'partials/otwork/editor/editor.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: 'OTWorkEditorCtrl',
                resolve: {
                    loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['partials/otwork/editor/editor.controller.js']
                        });
                    }]
                }
            });
        };
    }]);

    return otModule;
});