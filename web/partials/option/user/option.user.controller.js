define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.user',
    'boss.api.department',
    'metronic'
], function (ng, moment, _, settings, optionModule) {
    'use strict';

    function UserOptionCtrl($scope, $rootScope, $q, $cookies, $mdDialog, $mdToast, userApi, deptApi) {

        $scope.raw_users = [];
        $scope.users = [];
        $scope.pagination = {
            totalItems: 0,
            currentPage: 1,
            itemsPerPage: 15
        }

        $scope.departments = [];
        deptApi.get().$promise
            .then(function (depts) {
                $scope.departments = depts.data;
                refresh();
            });

        $scope.pageChanged = function () {
            var start = $scope.pagination.itemsPerPage * ($scope.pagination.currentPage - 1);
            var end = start + $scope.pagination.itemsPerPage;
            $scope.users = _.slice($scope.raw_users, start, end);
        };

        var refresh = function () {
            userApi.get().$promise.then(function (users) {
                $scope.raw_users = _.sortBy(users.data, ['id']);
                $scope.pagination.totalItems = $scope.raw_users.length;
                //$scope.pagination.currentPage = 1;                
                $scope.pageChanged();
            });
        }

        $scope.$on('USERS_RELOAD', function () {
            refresh();
        });

        $scope.remove = function (user) {
            (function () {
                var confirm = $mdDialog.confirm()
                    .title('是否删除用户"' + user.name + '"?')
                    .ariaLabel('用户删除确认对话框')
                    .ok('删除')
                    .cancel('取消');

                $mdDialog.show(confirm)
                    .then(function () {
                        userApi.remove({
                                id: user.id
                            }).$promise
                            .then(function (ret) {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .textContent('用户"' + user.name + '"已删除!')
                                    .position('bottom right')
                                    .hideDelay(3000)
                                );
                                refresh();
                            });
                    });
            })();
        }

        $scope.modify = function (user) {
            $scope.showNewUserDialog(user);
        }

        $scope.showNewUserDialog = function (user) {
            $mdDialog.show({
                templateUrl: 'partials/option/user/editor/editor.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: 'UserEditorCtrl',
                resolve: {
                    loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['partials/option/user/editor/editor.controller.js']
                        });
                    }],
                    user: function () {
                        return user;
                    }
                }
            });
        };
    }

    optionModule.filter('DeptRender', function () {
        var filter = function (input, depts) {
            var dept = _.find(depts, {id: input});
            return dept ? dept.name : input;
        };
        return filter;
    });

    optionModule.filter('SexRender', function () {
        var filter = function (input) {
            return input == 'MAN' ? '男' : '女';
        };
        return filter;
    });

    optionModule.filter('UserRender', function () {
        var filter = function (input, users) {
            var str = '';
            _.each(input, function (text, idx) {
                var user = _.find(users, {
                    account: text
                });
                str += ',';
                if (user) {
                    str += user.name;
                } else {
                    str += text;
                }
            });
            return str.substr(1);
        };
        return filter;
    });

    optionModule.filter('RoleRender', function () {
        var filter = function (input) {
            var str = '';
            _.each(input, function (text, idx) {
                str += ',';
                str += settings.roles[text].name
            });
            return str.substr(1);
        };
        return filter;
    });

    optionModule.controller('UserOptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        '$mdDialog',
        '$mdToast',
        'boss.api.user',
        'boss.api.department',
        UserOptionCtrl
    ]);
});