define([
    'angular',
    'angular-cookies',
    'angular-bootstrap',
    'boss.api',
], function(ng) {
    'use strict';

    var logModule = ng.module('boss.log', [
        'ngCookies',
        'ui.bootstrap',
        'boss.api'
    ]);

    logModule
        .config(['$controllerProvider',
            function($controllerProvider) {
                logModule.controller = $controllerProvider.register;
            }
        ]);

    logModule
        .config(['$stateProvider',
            function($stateProvider) {

                // log
                $stateProvider.state({
                    abstract: true,
                    name: 'log',
                    url: '/log',
                    template: '<div ui-view />'
                });

                // log.search
                $stateProvider.state({
                    name: 'log.search',
                    url: '/search',
                    templateUrl: 'partials/log/search/search.tmpl.html',
                    controller: 'LogSearchCtrl',
                    resolve: {
                        loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: ['partials/log/search/search.controller.js']
                            });
                        }]
                    }
                });
            }
        ]);

    logModule.run(['$rootScope', '$mdDialog', function($rootScope, $mdDialog) {

        $rootScope.$on('BOSS_NEW_LOG', function(evt) {
            showLogModify();
        });

        var showLogModify = function() {
            $mdDialog.show({
                templateUrl: 'partials/log/editor/editor.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: 'LogEditorCtrl',
                resolve: {
                    loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['partials/log/editor/editor.controller.js']
                        });
                    }]
                }
            });
        };
    }]);

    return logModule;
});