define([
    'angular',
    'angular-cookies',
    'angular-material',
    'boss.login',
    'boss.log',
    'boss.kpi'
], function(ng) {
    'use strict';

    var indexModule = ng.module('boss.index', [
        'oc.lazyLoad',
        'ui.router',
        'ngCookies',
        'ngMaterial',
        'boss.login',
        'boss.log',
        'boss.kpi'
    ]);

    indexModule
        .config(['$stateProvider', '$locationProvider',
            function($stateProvider, $locationProvider) {
                $locationProvider.html5Mode(true);
            }
        ]);

    indexModule.config(['$qProvider', function($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

    return indexModule;

});