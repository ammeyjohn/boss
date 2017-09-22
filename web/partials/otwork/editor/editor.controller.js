define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.otwork',
    'boss.api.otwork',
    'directive.datetimepicker'
], function(ng, moment, _, settings, otModule) {
    'use strict';

    function OTWorkEditorCtrl($scope, $rootScope, $cookies, $mdToast, $mdDialog, otApi) {

        var credential = $cookies.getObject('credential');
        var default_otwork = {
            id: 0,
            content: null,
            startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            departmentId: credential.user.department,
            account: credential.user.account,
            notifier: credential.user.account + ";" + credential.user.notifier.join(";"),
            mealCount: 0
        };

        $scope.otwork = _.cloneDeep(default_otwork);

        $scope.save = function(close) {
            otApi.add($scope.otwork).$promise.then(function(otwork) {

                $mdToast.show(
                    $mdToast.simple()
                    .textContent('加班记录添加成功!')
                    .position('bottom right')
                    .hideDelay(3000)
                );

                if (close) {
                    $mdDialog.hide();
                }
            });
        }

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    otModule.controller('OTWorkEditorCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        '$mdToast',
        '$mdDialog',
        'boss.api.otwork',
        OTWorkEditorCtrl
    ]);
});