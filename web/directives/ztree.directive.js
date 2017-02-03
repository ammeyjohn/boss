define([
    'angular',
    'ztree'
], function(ng) {
    'use strict';

    var ztreeModule = angular.module('ztree', []);

    // ecModule
    //     .config(['$compileProvider',
    //         function($compileProvider) {
    //         	ecModule.directive = $compileProvider.directive;
    //         }
    //     ]);

    var ztreeCtrl = function($rootScope) {
        return {
            restrict: 'AE',
            scope: {
                checkable: '=ztreeCheckable',
                nodes: '=ztreeNodes'
            },
            link: function(scope, elem, attrs) {
                var tree = null;

                var option = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    }
                };
                if (scope.checkable) {
                    option.check = {
                        enable: true
                    }
                }

                scope.$watch('nodes', function(nodes) {
                    initTree(nodes);
                });

                var initTree = function(nodes) {
                    if (tree) {
                        tree.destroy();
                        tree = null;
                    }

                    if (tree === null) {
                        $(elem).addClass('ztree');
                        tree = $.fn.zTree.init(elem, option, nodes);
                    }
                }

                initTree(scope.nodes);
            }
        };
    }

    ztreeModule.directive('ztree', ztreeCtrl);

    return ztreeModule;
});