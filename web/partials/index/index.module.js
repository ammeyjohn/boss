define([
    'angular',
    'angular-cookies',
    'angular-material',
    'angular-block-ui',
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
        'blockUI',
        'boss.login',
        'boss.log',
        'boss.kpi'
    ]);

    indexModule
        .config(['$locationProvider', 'blockUIConfig',
            function($locationProvider, blockUIConfig) {
                $locationProvider.html5Mode(true);

                blockUIConfig.template = `<div class="block-ui-overlay"></div>
                                          <div class="block-ui-message-container">
                                                <div class="block-ui-message" ng-class="$_blockUiMessageClass">
                                                    <img style="" src="partials/index/img/loading.gif" align="">
                                                    正在加载……
                                                </div>
                                          </div>`;
            }
        ]);

    /* 加入拦截器 */
    // indexModule
    //     .config(['$httpProvider',
    //         function($httpProvider) {
    //             $httpProvider.interceptors.push(['$location', '$q', 'blockUI',
    //                 function($location, $q, blockUI) {
    //                     var interceptor = {
    //                         request: function(request) {
    //                             console.log('request');
    //                             return request;
    //                         },
    //                         response: function(response) {
    //                             console.log('response');
    //                             return response;
    //                         }
    //                     };
    //                     return interceptor;
    //                 }
    //             ]);
    //         }
    //     ]);

    indexModule.config(['$qProvider', function($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

    return indexModule;

});