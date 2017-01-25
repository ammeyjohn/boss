/// This is the main entry point of the site.
/// Make sure this file has been refered in app.html before other js file.

(function(window) {
    'use strict';

    // Avoid `console` errors in browsers that lack a console.    
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    // 初始化 RequireJS
    requirejs.config({
        baseUrl: '/',
        waitSeconds: 30,
        paths: {
            /* 定义第三方组件库 */
            /* jquery */
            'jquery': 'assets/vendor/jquery/dist/jquery.min',

            /* 第三方组件 */
            'lodash': 'assets/vendor/lodash/dist/lodash.min',
            'moment': 'assets/vendor/moment/min/moment-with-locales.min',
            'crossfilter': 'assets/vendor/crossfilter2/crossfilter.min',
            'ztree': 'assets/vendor/ztree_v3/js/jquery.ztree.all.min',

            /* Bootstrap */
            'bootstrap': 'assets/vendor/bootstrap/dist/js/bootstrap.min',
            'bootstrap-css': 'assets/vendor/bootstrap/dist/css/bootstrap.min',
            'datetimepicker': 'assets/vendor/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
            'datetimepicker-css': 'assets/vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min',

            /* AngularJS */
            'angular': 'assets/vendor/angular/angular.min',
            'angular-messages': 'assets/vendor/angular-messages/angular-messages.min',
            'angular-resource': 'assets/vendor/angular-resource/angular-resource.min',
            'angular-sanitize': 'assets/vendor/angular-sanitize/angular-sanitize.min',
            'angular-animate': 'assets/vendor/angular-animate/angular-animate.min',
            'angular-touch': 'assets/vendor/angular-touch/angular-touch.min',
            'angular-cache': 'assets/vendor/angular-cache/dist/angular-cache.min',
            'angular-cookies': 'assets/vendor/angular-cookies/angular-cookies.min',
            'angular-aria': 'assets/vendor/angular-aria/angular-aria.min',
            'angular-ui-router': 'assets/vendor/angular-ui-router/release/angular-ui-router.min',
            'angular-ui-select': 'assets/vendor/angular-ui-select/dist/select.min',
            'angular-local-storage': 'assets/vendor/angular-local-storage/dist/angular-local-storage.min',
            'angular-bootstrap': 'assets/vendor/angular-bootstrap/ui-bootstrap-tpls.min',
            'angular-material': 'assets/vendor/angular-material/angular-material.min',

            /* AngularJS Directives */
            'oclazyload': 'assets/vendor/oclazyload/dist/ocLazyLoad.require.min',

            /* 定义CSS样式库 */
            'font-awesome': 'assets/vendor/font-awesome/css/font-awesome.min',

            /* Echarts */
            'echarts.full': 'assets/plugin/echarts/echarts.min',
            'echarts.common': 'assets/plugin/echarts/echarts.common.min',
            'echarts.simple': 'assets/plugin/echarts/echarts.simple.min',

            /* 定义资源文件夹 */
            'vendor': 'assets/vendor',
            'plugin': 'assets/plugins',

            /* 定义全局模块 */

            /* 定义系统服务 */

            /* 定义模块文件夹 */
            'boss.login': 'partials/login/login.module',
            'boss.log': 'partials/log/log.module',
            'boss.kpi': 'partials/kpi/kpi.module',

            /* 定义其他组件 */
            'directive.datetimepicker': 'directives/datetimepicker.directive',
            'directive.echarts': 'directives/echarts.directive',
            'directive.ztree': 'directives/ztree.directive',

            /* 资源脚本 */
            'boss.api': 'resources/boss.api.module',
            'boss.api.auth': 'resources/boss.api.auth.resource',
            'boss.api.user': 'resources/boss.api.user.resource',
            'boss.api.department': 'resources/boss.api.department.resource',
            'boss.api.project': 'resources/boss.api.project.resource',
            'boss.api.log': 'resources/boss.api.log.resource'
        },
        shim: {
            'bootstrap': ['jquery', 'css!bootstrap-css'],
            'angular': {
                deps: ['jquery'],
                exports: 'angular'
            },
            'angular-messages': ['angular'],
            'angular-resource': ['angular'],
            'angular-sanitize': ['angular'],
            'angular-animate': ['angular'],
            'angular-touch': ['angular'],
            'angular-cookies': ['angular'],
            'angular-aria': ['angular'],
            'angular-ui-router': ['angular'],
            'angular-ui-select': ['angular', 'css!angular-ui-select'],
            'angular-local-storage': ['angular'],
            'angular-bootstrap': ['angular', 'bootstrap'],
            'angular-material': [
                'angular',
                'angular-animate',
                'angular-aria',
                'angular-messages',
                'css!angular-material'
            ],
            'oclazyload': ['angular'],

            /* 第三方组件 */
            'datetimepicker': [
                'jquery',
                'bootstrap',
                'moment',
                'css!datetimepicker-css'
            ],

            'crossfilter': {
                exports: 'crossfilter'
            },

            'ztree': ['jquery']
        },
        packages: [],
        map: {
            '*': {
                'css': '../../assets/vendor/require-css/css'
            }
        },
        deps: [],

        /* TODO：在正式上线前需要移除这行代码 */
        urlArgs: 'v=1.0.2.0'
    });

    /// 全局初始化 ///
    require(['moment'],
        function(moment) {
            moment.locale('zh-cn');
        });

    /// Bootstrap ///
    require([
            'angular',
            'angular-ui-router',
            'oclazyload',
            'bootstrap',
            './partials/index/index.module',
            './partials/index/index.controller'
        ],
        function(ng) {
            ng.element(document).ready(function() {
                ng.bootstrap(document, ['boss.index']);
            });
        });

})(window);