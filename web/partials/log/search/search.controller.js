define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.log',
    'boss.api.project',
    'boss.api.log',
    'directive.datetimepicker'
], function(ng, moment, _, settings, logModule) {
    'use strict';

    function LogSearchCtrl($scope, $rootScope, $cookies, prjApi, logApi) {

        $scope.logTypes = settings.logTypes;

        $scope.pagination = {
            totalItems: 0,
            currentPage: 1,
            itemsPerPage: 15
        }

        $scope.pageChanged = function() {
            var start = $scope.pagination.itemsPerPage * ($scope.pagination.currentPage-1);
            var end = start + $scope.pagination.itemsPerPage;
            $scope.paged_logs = _.slice(raw_logs, start, end);

        };

        var credential = $cookies.getObject('credential');

        $scope.condition = {
            logType: 2,
            projectCode: '',
            user: credential.account,
            logStartTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            logEndTime: moment().format('YYYY-MM-DD')
        };

        // 加载项目编号列表
        prjApi.getProjectByUser({
            user: credential.account
        }).$promise.then(function(projects) {
            $scope.projects = projects.data;
            $scope.projects.unshift({
                projectCode: ''
            });
        });

        var raw_logs = null;
        $scope.search = function() {
            logApi.queryLogs($scope.condition).$promise.then(function(logs) {
                raw_logs = logs.data;
                $scope.pagination.totalItems = raw_logs.length;
                $scope.pagination.currentPage = 1;
                $scope.pageChanged();
            });
        }
    }

    logModule.controller('LogSearchCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        'boss.api.project',
        'boss.api.log',
        LogSearchCtrl
    ]);
});