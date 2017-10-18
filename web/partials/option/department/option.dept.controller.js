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
                onClick: nodeClick
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

        function nodeClick(node, treeId, treeNode) {
            $scope.curDept = {
                _id: treeNode._id,
                id: treeNode.id,
                name: treeNode.name,
                code: treeNode.code,
                parent: treeNode.parent
            }
            $scope.$apply();
        }

        $scope.addDept = function() {
            $scope.curDept = {
                parent: $scope.curDept.id
            };
        }

        $scope.removeDept = function() {

        }

        $scope.save = function() {
            deptApi.save({
                    dept: $scope.curDept
                }).$promise
                .then(function() {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('部门添加成功!')
                        .position('bottom right')
                        .hideDelay(3000)
                    );
                    init();
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