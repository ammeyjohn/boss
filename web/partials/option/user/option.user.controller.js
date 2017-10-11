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

    function UserOptionCtrl($scope, $rootScope, $q, $cookies, userApi, deptApi) {

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
    }

    optionModule.controller('UserOptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        'boss.api.user',
        'boss.api.department',
        UserOptionCtrl
    ]);
});