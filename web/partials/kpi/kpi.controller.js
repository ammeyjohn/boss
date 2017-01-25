define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.kpi',
    'boss.api.user',
    'boss.api.project',
    'boss.api.log',
    'directive.datetimepicker'
], function(ng, moment, _, settings, kpiModule) {
    'use strict';

    function KpiCtrl($scope, $rootScope, $cookies, userApi, prjApi, logApi) {

        // 加载用户列表
        $scope.users = null;
        userApi.get().$promise.then(function(users) {
            $scope.users = _.orderBy(users.data, ['department'], ['desc']);
        });

    }

    kpiModule.controller('KpiCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        'boss.api.user',
        'boss.api.project',
        'boss.api.log',
        KpiCtrl
    ]);
});
