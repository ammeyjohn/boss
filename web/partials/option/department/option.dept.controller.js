define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.department',
    'metronic'
], function (ng, moment, _, settings, optionModule) {
    'use strict';

    function DeptOptionCtrl($scope, $rootScope, $q, $mdToast, deptApi) {

        $scope.depts = [];

        var buildTree = function (depts) {
            var nodes = [];
            _.each(depts, function (dept) {
                var node = {
                    id: dept.id,
                    pId: !dept.parent ? 0 : dept.parent,
                    name: dept.name,
                    open: true,
                    data: dept
                }
                nodes.push(node);
            });

            return nodes;
        }

        var init = function () {
            deptApi.get().$promise
                .then(function (depts) {
                    depts.data.push({
                        id: 0,
                        pId: -9999,
                        name: '上海三高',
                        code: 'SH3H'
                    });
                    $scope.depts = buildTree(depts.data);
                });
        };

        init();

        $scope.curDept = null;

        $scope.click = function (node, treeId, treeNode) {
            $scope.curDept = _.cloneDeep(treeNode.data);
            $scope.$apply();
        }

        $scope.addDept = function () {
            $scope.curDept = {
                parent: $scope.curDept.id
            };
        }

        $scope.removeDept = function () {

        }

        $scope.add = function () {
            deptApi.add({
                    dept: $scope.curDept
                }).$promise
                .then(function () {
                    init();
                });
        }

        $scope.update = function () {
            deptApi.modify({
                    id: $scope.curDept._id
                }, {
                    dept: $scope.curDept
                }).$promise
                .then(function () {
                    init();
                });
        }
    }

    optionModule.controller('DeptOptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$mdToast',
        'boss.api.department',
        DeptOptionCtrl
    ]);
});