define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.user',
    'boss.api.department',
], function (ng, moment, _, settings, optionModule) {
    'use strict';

    function UserEditorCtrl($scope, $rootScope, $cookies, $mdToast, $mdDialog, userApi, deptApi) {
        $scope.user = {
            name: null,
            account: null,
            sex: '男',
            department: 25,
            notifier: []
        }

        // 部门列表
        $scope.departments = null;

        // 用户列表        
        $scope.users = null;

        // 加载用户列表
        userApi.get().$promise.then(function (users) {
            $scope.users = users.data;
        });

        // 加载部门列表
        deptApi.get().$promise.then(function (departments) {
            $scope.departments = departments.data;
        });

        $scope.save = function () {
            console.log($scope.user);
        }
    }

    optionModule.controller('UserEditorCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        '$mdToast',
        '$mdDialog',
        'boss.api.user',
        'boss.api.department',
        UserEditorCtrl
    ]);
});