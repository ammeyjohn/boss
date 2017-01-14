define([
    'angular',
    'echarts.full'
], function(ng, echarts) {
    'use strict';

    var ecModule = angular.module('echarts', []);

    // ecModule
    //     .config(['$compileProvider',
    //         function($compileProvider) {
    //         	ecModule.directive = $compileProvider.directive;
    //         }
    //     ]);

    var ec = function($rootScope) {
        return {
            restrict: 'AE',
            scope: {
                option: '=ecOption'
            },
            link: function(scope, elem, attrs) {
                var chart = echarts.init(elem[0]);
                scope.$watch('option', function(newOption) {
                    if (newOption) {
                        chart.setOption(newOption);
                    }
                }, true);

                scope.$on('BOSS_WINDOWS_RESIZED', function(){
                    chart.resize();
                });
            }
        };
    }

    ecModule.directive('echarts', ec);

    return ecModule;
});