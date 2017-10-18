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

    function DeptOptionCtrl($scope, $rootScope, $mdToast, deptApi) {

        $scope.option = {
            data: {
                simpleData: {
                    enable: true,
                    pIdKey: 'parent'
                }
            },
            callback: {
                onClick: nodeClick,
                onRemove: nodeRemove,
                onDrop: nodeDrop
            },
            edit: {
                enable: true,
                drag: {
                    isCopy: false
                },
                removeTitle: '删除',
                showRemoveBtn: true,
                showRenameBtn: false
            }
        }
        $scope.treeObj = null;

        $scope.depts = [];

        var init = function() {
            deptApi.get().$promise
                .then(function(depts) {
                    depts.data.push({
                        id: 0,
                        parent: null,
                        name: '上海三高',
                        code: 'SH3H'
                    });
                    _.each(depts.data, (d) => {
                        d.open = true;
                    });
                    $scope.depts = depts.data;
                });
        };

        init();

        $scope.curDept = null;
        $scope.mode = null;

        function nodeDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
            // var srcNode = treeNodes[0];
            // var dept = {
            //     _id: srcNode._id,
            //     id: srcNode.id,
            //     name: srcNode.name,
            //     code: srcNode.code,
            //     parent: targetNode.id
            // }
            // deptApi.save({
            //         dept: dept
            //     }).$promise
            //     .then(function(ret) {
            //         if (ret) {
            //             init();
            //             $scope.$apply();
            //         }
            //     });
        }

        function nodeClick(event, treeId, treeNode) {
            $scope.curDept = {
                _id: treeNode._id,
                id: treeNode.id,
                name: treeNode.name,
                code: treeNode.code,
                parent: treeNode.parent
            }
            $scope.$apply();
        }

        function nodeRemove(event, treeId, treeNode) {
            deptApi.remove({ key: treeNode._id }).$promise
                .then(function(ret) {
                    if (ret) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('部门"' + treeNode.name + '"已经删除!')
                            .position('bottom right')
                            .hideDelay(3000)
                        );
                        init();
                    }
                });
            $scope.$apply();
        }

        $scope.addDept = function() {
            $scope.curDept = {
                parent: $scope.curDept.id
            };
        }

        $scope.save = function() {
            deptApi.save({
                    dept: $scope.curDept
                }).$promise
                .then(function(ret) {
                    if (ret) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('部门添加成功!')
                            .position('bottom right')
                            .hideDelay(3000)
                        );
                        init();
                    }
                });
        }
    }

    optionModule.controller('DeptOptionCtrl', [
        '$scope',
        '$rootScope',
        '$mdToast',
        'boss.api.department',
        DeptOptionCtrl
    ]);
});