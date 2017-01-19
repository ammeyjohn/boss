define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.log',
    'boss.api.project',
    'directive.datetimepicker'
], function(ng, moment, _, settings, logModule) {
    'use strict';

    function LogConditionCtrl($scope, $rootScope, $cookies, prjApi) {

        var DATE_FORMAT = 'YYYY-MM-DD';

        // 用户权限
        var credential = $cookies.getObject('credential');

        var default_condition = {
            logType: 2,
            projectCode: null,
            users: [credential.account],
            logStartTime: moment().startOf('month').format(DATE_FORMAT),
            logEndTime: moment().endOf('month').format(DATE_FORMAT),
            recordStartTime: null,
            recordEndTime: null
        }

        // 常用项目列表
        $scope.projects = [];

        // 日志类型
        $scope.logTypes = settings.logTypes;

        // 用户列表
        $scope.users = settings.users;

        // 条件对象
        $scope.condition = _.cloneDeep(default_condition);

        // 加载常用项目编号列表
        prjApi.getProjectByUser({
            user: credential.account
        }).$promise.then(function(projects) {
            $scope.projects = projects.data;
        });

        $scope.quickSearch = function(timeSpan) {
            var st, et;
            switch (timeSpan) {
                case 'Today':
                    st = moment();
                    et = moment().add(1, 'days');
                    break;
                case 'Yesterday':
                    st = moment().subtract(1, 'days');
                    et = moment();
                    break;
                case 'CurWeek':
                    st = moment().day(0).add(1, 'days');
                    et = moment().day(7);
                    break;
                case 'PreWeek':
                    st = moment().day(0).subtract(6, 'days');
                    et = moment().day(7).subtract(7, 'days');
                    break;
                case 'CurMonth':
                    st = moment().startOf('month');
                    et = moment().endOf('month');
                    break;
                case 'PreMonth':
                    st = moment().startOf('month').subtract(1, 'months');
                    et = moment().endOf('month').subtract(1, 'months');
                    break;
                case 'CurYear':
                    st = moment().startOf('year');
                    et = moment().endOf('year');
                    break;
                case 'PreYear':
                    st = moment().startOf('year').subtract(1, 'years');
                    et = moment().endOf('year').subtract(1, 'years');
                    break;
            }

            $scope.condition.logStartTime = st.format(DATE_FORMAT);
            $scope.condition.logEndTime = et.format(DATE_FORMAT);
            $scope.search();
        }

        $scope.clear = function() {
            $scope.condition = _.cloneDeep(default_condition);
        }

        $scope.clearRecordTime = function() {
            $scope.condition.recordStartTime = null;
            $scope.condition.recordEndTime = null;
        }

        $scope.clearLogTime = function() {
            $scope.condition.logStartTime = null;
            $scope.condition.logEndTime = null;
        }

        $scope.search = function() {
            $rootScope.$broadcast('BOSS_SEARCH', $scope.condition);
        }
    }

    logModule.controller('LogConditionCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        'boss.api.project',
        LogConditionCtrl
    ]);
});