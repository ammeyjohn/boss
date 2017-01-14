define([
    'angular',
    'angular-sanitize',
    'angular-cookies',
    'angular-bootstrap',
    'angular-ui-select',
    'directive.echarts',
    'boss.api'
], function(ng) {
    'use strict';

    var logModule = ng.module('boss.log', [
        'ngCookies',
        'ngSanitize',
        'ui.bootstrap',
        'ui.select',
        'echarts',
        'boss.api'
    ]);

    logModule
        .config(['$controllerProvider', '$filterProvider',
            function($controllerProvider, $filterProvider) {
                logModule.controller = $controllerProvider.register;
                logModule.filter = $filterProvider.register;
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
                    views: {
                        '@log': {
                            templateUrl: 'partials/log/search/search.tmpl.html',
                            controller: 'LogSearchCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/log/search/search.controller.js']
                                    });
                                }]
                            }
                        },
                        '@log.search': {
                            templateUrl: 'partials/log/condition/condition.tmpl.html',
                            controller: 'LogConditionCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/log/condition/condition.controller.js']
                                    });
                                }]
                            }
                        }
                    }
                });

                // log.analyze
                $stateProvider.state({
                    name: 'log.analyze',
                    url: '/analyze',
                    views: {
                        '@log': {
                            templateUrl: 'partials/log/analyze/analyze.tmpl.html',
                            controller: 'LogAnalyzeCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/log/analyze/analyze.controller.js']
                                    });
                                }]
                            }
                        },
                        '@log.analyze': {
                            templateUrl: 'partials/log/condition/condition.tmpl.html',
                            controller: 'LogConditionCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/log/condition/condition.controller.js']
                                    });
                                }]
                            }
                        }
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