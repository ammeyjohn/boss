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
    'directive.datetimepicker',
    'css!metronic-style',
], function(ng, moment, _, settings, kpiModule) {
    'use strict';

    function KpiCtrl($scope, $rootScope, $q, $cookies, userApi, deptApi, prjApi, logApi) {

        // // 加载用户列表
        // $scope.users = null;
        // $scope.nodes = null;

        // $q.all([
        //     userApi.get().$promise,
        //     deptApi.get().$promise
        // ]).then(function(results) {

        //     var nodes = [];

        //     _.each(results[1].data, function(dept) {
        //         nodes.push({
        //             id: 'D' + dept.id,
        //             pId: dept.parent === null ? 'ROOT' : 'D' + dept.parent,
        //             name: dept.name,
        //             open: true
        //         });
        //     });

        //     var users = results[0].data;
        //     _.each(users, function(user) {
        //         nodes.push({
        //             id: user.id,
        //             pId: 'D' + user.department,
        //             name: user.name
        //         });
        //     });

        //     $scope.nodes = _.orderBy(nodes, ['id'], ['asc']);

        // });

        $scope.dashboard = {
            taskTime: 0,
            overTime: 0,
            travelTime: 0,
            projectCount: 0
        }

        $scope.option = {
            grid: {
                top: 10,
                left: 40,
                right: 30
            },
            tooltip: {
                formatter: function(params, ticket, callback) {
                    var format = params.name;
                    format += '<br />';
                    format += '工时: ' + params.value.toFixed(2) + ' 人日';
                    return format;
                }           
            },
            xAxis: {
                type: 'category',
                data: null,
                axisLabel: {
                    rotate: 45,
                    interval: 0,
                    textStyle: {
                        fontSize: 10
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '工单统计（人日）',
                min: 0,
                axisLabel: {
                    interval: 10
                }
            },
            series: [{
                name: 'taskTime',
                type: 'bar',
                data: null
            }]
        };


        var DATE_FORMAT = 'YYYY-MM-DD';

        var condition = {
            logType: null,
            projectCode: [],
            departments: [25],
            users: [],
            logStartTime: moment().startOf('year').format(DATE_FORMAT),
            logEndTime: moment().endOf('year').format(DATE_FORMAT),
            recordStartTime: null,
            recordEndTime: null
        }

        logApi.queryLogs(condition).$promise.then(function(logs) {

            // 工时统计            
            $scope.dashboard.taskTime = _.sumBy(logs.data, 'workTime') / 480;

            // 项目统计
            var projectGroup = _.groupBy(logs.data, 'projectCode');
            var projectCodes = _.keys(projectGroup);
            $scope.dashboard.projectCount = projectCodes.length;

            // 统计各项目工时
            var sumOfProjectGroup = {};
            _.reduce(projectGroup, function(result, log, key) {
                result[key] = _.sumBy(log, 'workTime') / 480;
                return result;
            }, sumOfProjectGroup);
            $scope.option.xAxis.data = projectCodes;
            $scope.option.series[0].data = _.values(sumOfProjectGroup);

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