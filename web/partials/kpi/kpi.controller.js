define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.kpi',
    'boss.api.user',
    'boss.api.department',
    'boss.api.project',
    'boss.api.log',
    'directive.datetimepicker'
], function(ng, moment, _, settings, kpiModule) {
    'use strict';

    function KpiCtrl($scope, $rootScope, $q, $cookies, userApi, deptApi, prjApi, logApi) {

        // 加载用户列表
        $scope.users = null;
        $scope.nodes = null;

        $q.all([
            userApi.get().$promise,
            deptApi.get().$promise
        ]).then(function(results) {

            var nodes = [];

            _.each(results[1].data, function(dept) {
                nodes.push({
                    id: 'D' + dept.id,
                    pId: dept.parent === null ? 'ROOT' : 'D' + dept.parent,
                    name: dept.name,
                    open: true
                });
            });

            var users = results[0].data;
            _.each(users, function(user) {
                nodes.push({
                    id: user.id,
                    pId: 'D' + user.department,
                    name: user.name
                });
            });

            $scope.nodes = _.orderBy(nodes, ['id'], ['asc']);

        });

    }

    kpiModule.controller('KpiCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        'boss.api.user',
        'boss.api.department',
        'boss.api.project',
        'boss.api.log',
        KpiCtrl
    ]);
});