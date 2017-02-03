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

    function LogEditorCtrl($scope, $rootScope, $cookies, $mdToast, $mdDialog, prjApi, logApi) {

        var credential = $cookies.getObject('credential');
        var default_log = {
            logId: 0,
            logType: 2,
            logTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            recordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            taskTime: null,
            projectCode: null,
            content: null,
            account: credential.user.account
        };

        $scope.log = _.cloneDeep(default_log);
        $scope.logTypes = settings.logTypes;
        $scope.projects = [];

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

        $scope.save = function(close) {
            logApi.add($scope.log).$promise.then(function(log) {

                $mdToast.show(
                    $mdToast.simple()
                    .textContent('日志添加成功!')
                    .position('bottom right')
                    .hideDelay(3000)
                );

                if (close) {
                    $mdDialog.hide();
                } else {
                    $scope.log.content = null;
                    $scope.log.taskTime = null;
                    $scope.log.logTime = moment().format('YYYY-MM-DD HH:mm:ss');
                }
            });
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    logModule.controller('LogEditorCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        '$mdToast',
        '$mdDialog',
        'boss.api.project',
        'boss.api.log',
        LogEditorCtrl
    ]);
});