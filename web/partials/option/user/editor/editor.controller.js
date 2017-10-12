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
            sex: 'MAN',
            department: 25,
            notifier: []
        }

        // requirejs(['../node_modules/pinyin/lib/pinyin'],
        //     function (pinyin) {
        //         $scope.$watch($scope.user.name, function (name) {
        //             if (name) {
        //                 $scope.account = pinyin($scope.name);
        //             }
        //         });
        //     });

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
            userApi.add(null, {
                    user: $scope.user
                }).$promise
                .then(function (res) {
                    console.log(res);
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('用户添加成功!')
                        .position('bottom right')
                        .hideDelay(3000)
                    );
                    $rootScope.$broadcast('USERS_RELOAD');
                    $mdDialog.hide();
                });
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
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