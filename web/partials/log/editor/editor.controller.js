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
            user: credential.account
        };

        $scope.log = _.cloneDeep(default_log);
        $scope.logTypes = settings.logTypes;
        $scope.projects = [];

        prjApi.getProjectByUser({
            user: credential.account
        }).$promise.then(function(projects) {
            $scope.projects = projects.data;
        });

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