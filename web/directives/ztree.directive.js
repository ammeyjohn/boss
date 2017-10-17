define([
    'angular',
    'ztree'
], function (ng) {
    'use strict';

    var ztreeModule = angular.module('ztree', []);

    var ztreeCtrl = function ($rootScope) {
        return {
            restrict: 'AE',
            scope: {
                checkable: '=ztreeCheckable',
                nodes: '=ztreeNodes'
            },
            link: function (scope, elem, attrs) {
                var tree = null;

                var option = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {}
                };
                if (scope.checkable) {
                    option.check = {
                        enable: true
                    }
                }

                if (attrs['ngClick']) {
                    option.callback.onClick = scope.$parent[attrs['ngClick']];
                }

                scope.$watch('nodes', function (nodes) {
                    initTree(nodes);
                });

                var initTree = function (nodes) {
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