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

        $scope.paged_logs = [];
        $scope.pagination = {
            totalItems: 0,
            currentPage: 1,
            itemsPerPage: 15
        }

        $scope.pageChanged = function() {
            var start = $scope.pagination.itemsPerPage * ($scope.pagination.currentPage - 1);
            var end = start + $scope.pagination.itemsPerPage;
            $scope.paged_logs = _.slice(raw_logs, start, end);

        };

        var raw_logs = null;
        $scope.$on('BOSS_SEARCH', function(evt, condition) {
            logApi.queryLogs(condition).$promise.then(function(logs) {
                raw_logs = logs.data;
                $scope.pagination.totalItems = raw_logs.length;
                $scope.pagination.currentPage = 1;
                $scope.pageChanged();
            });
        });
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