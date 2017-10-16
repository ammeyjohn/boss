define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.department',
    'metronic'
], function(ng, moment, _, settings, optionModule) {
    'use strict';

    function UserOptionCtrl($scope, $rootScope, $q, $cookies, $mdDialog, $mdToast, deptApi) {

        $scope.depts = [];

        (function() {
            deptApi.get().$promise
                .then(function(depts) {
                    $scope.depts = buildTree(depts.data);
                });

            var nodes = {};
            var buildTree = function(depts) {
                _.each(depts, function(dept) {
                    var node = {
                        id: dept.id,
                        title: dept.name,
                        nodes: [],
                        parent: dept.parent,
                        data: dept
                    }
                    nodes[node.id] = node;
                });

                _.each(nodes, function(node) {
                    if (nodes[node.parent]) {
                        nodes[node.parent].nodes.push(node);
                    }
                });

                return _.filter(_.values(nodes), { parent: null });
            }
        })();

        $scope.treeOptions = {
            dropped: function(evt) {
                console.log(evt);
            },
            removed: function(scope, a, b) {
                var nodeData = scope.$modelValue;
                console.log(nodeData);
            }
        }

        $scope.remove = function(scope) {
            var nodeData = scope.$modelValue;
            console.log(nodeData);
        }

        $scope.newSubItem = function(scope) {
            var nodeData = scope.$modelValue;
            console.log(nodeData);
            nodeData.nodes.push({
                id: nodeData.id * 10 + nodeData.nodes.length,
                title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                nodes: []
            });
        };
    }

    optionModule.controller('DeptOptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        '$mdDialog',
        '$mdToast',
        'boss.api.department',
        UserOptionCtrl
    ]);
});