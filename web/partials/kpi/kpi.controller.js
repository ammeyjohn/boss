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
    'angular-daterangepicker',
    'css!metronic-style',
], function(ng, moment, _, settings, kpiModule) {
    'use strict';

    function KpiCtrl($scope, $rootScope, $q, $cookies, userApi, deptApi, prjApi, logApi) {

        $scope.dashboard = {
            taskTime: 0,
            overTime: 0,
            travelTime: 0,
            projectCount: 0
        }

        $scope.drOption = {
            ranges: {
                '本周': [moment().day(0).add(1, 'days'), moment().day(7)],
                '上周': [moment().day(0).subtract(6, 'days'), moment().day(7).subtract(7, 'days')],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().startOf('month').subtract(1, 'months'), moment().endOf('month').subtract(1, 'months')],
                '今年': [moment().startOf('year'), moment().endOf('year')],
                '去年': [moment().startOf('year').subtract(1, 'years'), moment().endOf('year').subtract(1, 'years')],
                '最近30天': [moment().subtract(30, 'days'), moment()]
            },
            opens: 'left'
        }

        $scope.daterange = {
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
        };

        $scope.option = [{
            grid: {
                top: 10,
                left: 40,
                right: 30
            },
            tooltip: {
                formatter: function(params, ticket, callback) {
                    var project = sumOfProjectGroup[params.name];
                    var format = params.name + ' ' + project.projectName;
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
        }, {
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
                    rotate: 90,
                    interval: 0
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
        }];

        var sumOfProjectGroup = {};

        $scope.$watch('daterange', function(daterange) {
            if (daterange) {
                var condition = {
                    logType: null,
                    projectCode: [],
                    departments: [25],
                    users: [],
                    logStartTime: daterange.startDate,
                    logEndTime: daterange.endDate,
                    recordStartTime: null,
                    recordEndTime: null
                }

                logApi.queryLogs(condition).$promise.then(function(logs) {

                    // 总工时统计            
                    $scope.dashboard.taskTime = _.sumBy(logs.data, 'workTime') / 480;

                    // 项目分组统计
                    processProjectGroup(logs);

                    // 人员分组统计
                    processUserGroup(logs);
                });                
            }
        }, true);

        var processProjectGroup = function(logs) {

            var logGroupByProject = _.groupBy(logs.data, 'projectCode');
            $scope.dashboard.projectCount = _.keys(logGroupByProject).length;

            _.reduce(logGroupByProject, function(result, log, key) {
                result[key] = {
                    taskTime: _.sumBy(log, 'workTime') / 480,
                    projectCode: log[0].projectCode,
                    projectName: log[0].projectName
                }
                return result;
            }, sumOfProjectGroup);
            var orderedProjectGroup = _.orderBy(_.values(sumOfProjectGroup), ['taskTime'], ['desc']);
            $scope.option[0].xAxis.data =
                _.flatMap(orderedProjectGroup, function(d) {
                    return d.projectCode
                });
            $scope.option[0].series[0].data =
                _.flatMap(orderedProjectGroup, function(d) {
                    return d.taskTime
                });

            // 项目工期Top10
            $scope.top10Projects = _.take(orderedProjectGroup, 10);
        }

        var processUserGroup = function(logs) {
            var logGroupByUser = _.groupBy(logs.data, 'userName');
            var sumOfUserGroup =
                _.reduce(logGroupByUser, function(result, log, key) {
                    result.push({
                        userName: log[0].userName,
                        taskTime: _.sumBy(log, 'workTime') / 480
                    });
                    return result;
                }, []);
            var orderedUserGroup = _.orderBy(sumOfUserGroup, ['taskTime'], ['desc']);
            $scope.option[1].xAxis.data =
                _.flatMap(orderedUserGroup, function(d) {
                    return d.userName
                });
            $scope.option[1].series[0].data =
                _.flatMap(orderedUserGroup, function(d) {
                    return d.taskTime
                });

            // 人员工期Top10
            $scope.top10Users = _.take(orderedUserGroup, 5);
            $scope.last10Users = _.takeRight(orderedUserGroup, 5);
        }
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