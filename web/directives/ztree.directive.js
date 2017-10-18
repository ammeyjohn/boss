define([
    'angular',
    'ztree'
], function(ng) {
    'use strict';

    var ztreeModule = angular.module('ztree', []);

    var ztreeCtrl = function($rootScope) {
        return {
            restrict: 'AE',
            scope: {
                instance: '=ztreeObj',
                nodes: '=ztreeNodes'
            },
            link: function(scope, elem, attrs) {

                var option = scope.$parent[attrs['ztree']];

                scope.$watch('nodes', function(nodes) {
                    initTree(nodes);
                });

                var tree = null;
                var initTree = function(nodes) {
                    if (tree) {
                        tree.destroy();
                        tree = null;
                    }

                    if (tree === null) {
                        $(elem).addClass('ztree');
                        tree = $.fn.zTree.init(elem, option, nodes);
                    }

                    if (scope.instance !== undefined) {
                        scope.instance = tree;
                    }
                }

                initTree(scope.nodes);
            }
        };
    }

    ztreeModule.directive('ztree', ztreeCtrl);

    return ztreeModule;
});