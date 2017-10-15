define([
    'angular',
    'angular-sanitize',
    'angular-cookies',
    'angular-bootstrap',
    'angular-ui-select',
    'angular-ui-tree',
    'boss.api'
], function(ng) {
    'use strict';

    var otModule = ng.module('boss.option', [
        'ngCookies',
        'ngSanitize',
        'ui.bootstrap',
        'ui.select',
        'ui.tree',
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

                $stateProvider.state({
                    name: 'option',
                    url: '/option',
                    views: {
                        '@': {
                            controller: 'OptionCtrl',
                            templateUrl: 'partials/option/tabs/option.tabs.tmpl.html',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/option/tabs/option.tabs.controller.js']
                                    });
                                }]
                            }
                        },
                        'user-view@option': {
                            templateUrl: 'partials/option/user/option.user.tmpl.html',
                            controller: 'UserOptionCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/option/user/option.user.controller.js']
                                    });
                                }]
                            }
                        },
                        'dept-view@option': {
                            templateUrl: 'partials/option/department/option.dept.tmpl.html',
                            controller: 'DeptOptionCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/option/department/option.dept.controller.js']
                                    });
                                }]
                            }
                        }
                    }
                });

            }
        ]);

    return otModule;
});