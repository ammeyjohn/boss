define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.user',
    'boss.api.department',
    'metronic'
], function(ng, moment, _, settings, optionModule) {
    'use strict';

    function UserOptionCtrl($scope, $rootScope, $q, $cookies, $mdDialog, userApi, deptApi) {

        $scope.users = [];
        $scope.pagination = {
            totalItems: 0,
            currentPage: 1,
            itemsPerPage: 15
        }

        $scope.pageChanged = function() {
            var start = $scope.pagination.itemsPerPage * ($scope.pagination.currentPage - 1);
            var end = start + $scope.pagination.itemsPerPage;
            $scope.users = _.slice(raw_users, start, end);
        };

        var raw_users = null;
        userApi.get().$promise.then(function(users) {
            raw_users = _.sortBy(users.data, ['id']);
            $scope.pagination.totalItems = raw_users.length;
            $scope.pagination.currentPage = 1;
            $scope.pageChanged();

            deptApi.get().$promise.then(function(depts) {
                _.each(raw_users, function(user) {
                    user.department = _.find(depts.data, { id: user.department });
                    user.sex = user.sex == 'MAN' ? '男' : '女';
                });
            });
        });

        $scope.showNewUserDialog = function() {
            $mdDialog.show({
                templateUrl: 'partials/option/user/editor/editor.tmpl.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: 'UserEditorCtrl',
                resolve: {
                    loadModule: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: ['partials/option/user/editor/editor.controller.js']
                        });
                    }]
                }
            });
        };
    }

    optionModule.controller('UserOptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        '$mdDialog',
        'boss.api.user',
        'boss.api.department',
        UserOptionCtrl
    ]);
});