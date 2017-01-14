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

        // 用户权限
        var credential = $cookies.getObject('credential');

        // 常用项目列表
        $scope.projects = [];

        // 日志类型
        $scope.logTypes = settings.logTypes;

        // 条件对象
        $scope.condition = {
            logType: 2,
            projectCode: '',
            user: credential.account,
            logStartTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            logEndTime: moment().format('YYYY-MM-DD')
        };

        // 加载常用项目编号列表
        prjApi.getProjectByUser({
            user: credential.account
        }).$promise.then(function(projects) {
            $scope.projects = projects.data;
        });

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

    logModule.filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });
});
