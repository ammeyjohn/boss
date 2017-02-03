define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.log',
    'boss.api.user',
    'boss.api.project',
    'boss.api.department',
    'directive.datetimepicker',
    'directive.projects.select'
], function(ng, moment, _, settings, logModule) {
    'use strict';

    function LogConditionCtrl($scope, $rootScope, $cookies, $q, userApi, prjApi, deptApi, mode) {

        var DATE_FORMAT = 'YYYY-MM-DD';

        // 用户权限
        var credential = $cookies.getObject('credential');

        var default_condition = {
            logType: 2,
            projectCode: [],
            departments: null,
            users: [credential.user.account],
            logStartTime: moment().startOf('month').format(DATE_FORMAT),
            logEndTime: moment().endOf('month').format(DATE_FORMAT),
            recordStartTime: null,
            recordEndTime: null
        }

        // 条件对象
        $scope.condition = _.cloneDeep(default_condition);

        $scope.$watch('condition', function(cond){
            console.log(cond);
        }, true);

        // 查询条件模式
        // simple: 不包含用户和部门
        // advance: 包含用户和部门
        $scope.mode = mode || 'simple';

        // 用户列表        
        $scope.users = null;

        // 部门列表
        $scope.departments = null;

        // 日志类型
        $scope.logTypes = settings.logTypes;

        // 加载用户列表
        userApi.get().$promise.then(function(users) {
            $scope.users = users.data;
        });

        // 加载部门列表
        deptApi.get().$promise.then(function(departments) {
            $scope.departments = departments.data;
        });

        // 加载常用项目编号列表
        var projects = null;
        $scope.searchProjects = null;
        prjApi.getByAccount({
            account: credential.user.account
        }).$promise.then(function(results) {
            projects = results.data;
            $scope.searchProjects = _.orderBy(_.take(projects, 50), ['projectCode'], ['desc']);
        });

        $scope.refreshProjects = function(searchText) {
            if (searchText) {
                var matches = _.filter(projects, function(prj) {
                    return prj.projectCode.indexOf(searchText) >= 0 ||
                        prj.projectName.indexOf(searchText) >= 0;
                });
                $scope.searchProjects = _.orderBy(_.take(matches, 50), ['projectCode'], ['desc']);
            }
        }

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
        '$q',
        'boss.api.user',
        'boss.api.project',
        'boss.api.department',
        'mode',
        LogConditionCtrl
    ]);
});