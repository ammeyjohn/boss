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

    function DeptOptionCtrl($scope, $rootScope, $q, $mdToast, deptApi) {

        $scope.option = {
            data: {
                simpleData: {
                    enable: true
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
                    isCopy: false,
                    isMove: true,
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
                    $scope.depts = _.map(depts.data, (d) => {
                        return {
                            id: d.id,
                            name: d.name,
                            pId: d.parent,
                            open: true,
                            data: d
                        }
                    });
                });
        };

        init();

        var curNode = null;
        $scope.curDept = null;
        $scope.mode = null;

        function nodeDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
            var dept = treeNodes[0].data;
            dept.parent = targetNode.data.id;

            deptApi.save({
                    dept: dept
                }).$promise
                .then(function(ret) {
                    if (ret) {
                        init();
                    }
                });
        }

        function nodeClick(event, treeId, treeNode) {
            curNode = treeNode;
            $scope.curDept = _.cloneDeep(treeNode.data);
            $scope.$apply();
        }

        function nodeRemove(event, treeId, treeNode) {
            deptApi.remove({ key: treeNode.data._id }).$promise
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

        $scope.cancel = function() {
            $scope.curDept = curNode.data;
        }

        $scope.save = function() {

            var promises = [
                deptApi.save({
                    dept: $scope.curDept
                }).$promise
            ];

            // 如果调整了部门编号，需要同时调整部门的上级编号
            if ($scope.curDept.id != curNode.data.id) {
                _.each(curNode.children, (node) => {
                    var dept = _.cloneDeep(node.data);
                    dept.parent = $scope.curDept.id;
                    promises.push(deptApi.save({
                        dept: dept
                    }).$promise);
                });
            }

            $q.all(promises)
                .then((rets) => {
                    if (_.every(rets, { data: true })) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('部门保存成功!')
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
        '$q',
        '$mdToast',
        'boss.api.department',
        DeptOptionCtrl
    ]);
});