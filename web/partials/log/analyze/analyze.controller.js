define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.log',
    'boss.api.project',
    'boss.api.log',
    'directive.datetimepicker',
    'directive.echarts'
], function(ng, moment, _, settings, logModule) {
    'use strict';

    function LogAnalyzeCtrl($scope, $rootScope, $cookies, prjApi, logApi) {

        var credential = $cookies.getObject('credential');

        $scope.option = {
            title: {},
            tooltip: {
                trigger: 'item',
                formatter: function(params, ticket, callback) {
                    var format = params.name + ' ' + _.find($scope.data, {
                        projectCode: params.name
                    }).projectName;
                    format += '<br />';
                    format += '工时（人日）: ' + params.value.toFixed(2) + '(' + params.percent + '%)';
                    return format;
                }
            },
            legend: {},
            series: [{
                name: '项目工时',
                type: 'pie',
                radius: '75%',
                center: ['50%', '55%'],
                data: [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        $scope.data = {};

        $scope.$on('BOSS_SEARCH', function(evt, condition) {
            search(condition);
        });

        var search = function(condition) {
            logApi.queryLogs(condition).$promise.then(function(logs) {
                var times = {},
                    st = moment(condition.logStartTime),
                    et = moment(condition.logEndTime);
                if (st >= moment()) {
                    st = moment();
                }
                if (et >= moment()) {
                    et = moment();
                }
                while (st <= et) {
                    if (st.weekday() < 5) {
                        var dt = st.format('YYYY-MM-DD');
                        times[dt] = {
                            date: dt,
                            time: 0
                        };
                    }
                    st = st.add(1, 'days');
                }

                var data = {};

                _.each(logs.data, function(log, key) {

                    var workTime = parseInt(log.workTime);

                    // 按项目统计
                    if (!data[log.projectCode]) {
                        data[log.projectCode] = {
                            projectCode: log.projectCode,
                            projectName: log.projectName,
                            workTime: 0
                        };
                    }
                    data[log.projectCode].workTime += workTime;

                    // 按日期统计
                    var dt = moment(log.logTime).format('YYYY-MM-DD');
                    if (!times[dt]) {
                        times[dt] = {
                            date: dt,
                            time: 0
                        };
                    }
                    times[dt].time += workTime;
                });

                $scope.data = _.orderBy(_.each(_.values(data), function(d) {
                    d.duration = d.workTime / 480
                }), ['workTime'], ['desc']);

                $scope.option.series[0].data = _.map($scope.data, function(d) {
                    return {
                        value: d.duration,
                        name: d.projectCode
                    }
                });

                $scope.times = _.orderBy(times, ['date'], ['desc']);
            });
        }

        var condition = {
            logType: 2,
            projectCode: '',
            users: [credential.user.account],
            logStartTime: moment().startOf('month').format('YYYY-MM-DD'),
            logEndTime: moment().endOf('month').format('YYYY-MM-DD'),
            recordStartTime: null,
            recordEndTime: null
        }
        search(condition);

    }

    logModule.controller('LogAnalyzeCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        'boss.api.project',
        'boss.api.log',
        LogAnalyzeCtrl
    ]);
});