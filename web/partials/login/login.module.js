define([
    'angular',
    'angular-cookies',
    'angular-material',
    'boss.api'
], function(ng) {
    'use strict';

    var loginModule = ng.module('boss.login', [
        'ngCookies',
        'ngMaterial',
        'boss.api'
    ]);

    loginModule
        .config(['$controllerProvider',
            function($controllerProvider) {
                loginModule.controller = $controllerProvider.register;
            }
        ]);

    loginModule
        .config(['$stateProvider',
            function($stateProvider) {

                // login
                $stateProvider.state({                    
                    name: 'login',
                    code: 'LOGIN',
                    url: '/login',
                    template: '<div ui-view />',
                    controller: 'LoginCtrl',
                    resolve: {
                        loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: ['partials/login/login.controller.js']
                            });
                        }]
                    }                    
                });
            }
        ])

    return loginModule;
});