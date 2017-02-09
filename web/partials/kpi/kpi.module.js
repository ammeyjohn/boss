define([
    'angular',
    'angular-sanitize',
    'angular-cookies',
    'angular-bootstrap',
    'angular-ui-select',
    'angular-daterangepicker',
    'directive.echarts',
    'directive.ztree',
    'boss.api'
], function(ng) {
    'use strict';

    var kpiModule = ng.module('boss.kpi', [
        'ngCookies',
        'ngSanitize',
        'ui.bootstrap',
        'ui.select',
        'daterangepicker',
        'echarts',
        'ztree',
        'boss.api'
    ]);

    kpiModule
        .config(['$controllerProvider',
            function($controllerProvider) {
                kpiModule.controller = $controllerProvider.register;
            }
        ]);

    kpiModule
        .config(['$stateProvider',
            function($stateProvider) {

                // kpi
                $stateProvider.state({
                    name: 'kpi',
                    url: '/kpi',
                    views: {
                        '@': {
                            templateUrl: 'partials/kpi/kpi.tmpl.html',
                            controller: 'KpiCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/kpi/kpi.controller.js']
                                    });
                                }]
                            }
                        },
                        '@kpi': {
                            templateUrl: 'partials/log/condition/condition.tmpl.html',
                            controller: 'LogConditionCtrl',
                            resolve: {
                                loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        files: ['partials/log/condition/condition.controller.js']
                                    });
                                }],
                                mode: function() {
                                    return 'advance';
                                }
                            }
                        }
                    }
                });
            }
        ]);


    return kpiModule;
});