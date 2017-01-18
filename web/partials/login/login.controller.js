define([
    'angular',
    'lodash',
    'boss.login',
    'boss.api.user'
], function(ng, _, loginModule) {
    'use strict';

    function LoginCtrl($scope, $state, $cookies, $mdDialog, userApi) {

        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: LoginDialogCtrl,
                templateUrl: 'partials/login/login.tmpl.html',
                parent: angular.element(document.body),
                locals: {
                    "userApi": userApi
                },
                targetEvent: ev,
                escapeToClose: false,
                clickOutsideToClose: false,
                fullscreen: true
            }).then(function(loginInfo) {
                loginInfo.account = loginInfo.user.account;
                $cookies.putObject('credential', loginInfo);
                $state.go('log.analyze');
            });
        };

        $scope.showAdvanced();
    }

    function LoginDialogCtrl($scope, $state, $timeout, $mdDialog, userApi) {

        $scope.loginFailed = false;
        $scope.loginInfo = {
            account: null,
            password: null
        }
        $scope.errorMessage = '';

        $scope.login = function() {
            if (!$scope.loginInfo.account || !$scope.loginInfo.password) {
                $scope.loginFailed = true;
                $scope.errorMessage = '请先输入用户名和密码。';
                return;
            }
            userApi.login($scope.loginInfo).$promise.then(function(result) {
                if (result.data && result.data.success) {
                    $mdDialog.hide(result.data);
                } else {
                    console.log(result);
                    $scope.loginFailed = true;
                    $scope.errorMessage = result.error.message;
                }
            });
        }

        $scope.pressNext = function(evt) {
            if (evt.key === 'Enter') {
                $('#password').focus();
            }
        }

        $scope.pressLogin = function(evt) {
            if (evt.key === 'Enter') {
                $scope.login();
            }
        }
    }

    loginModule.controller('LoginCtrl', [
        '$scope',
        '$state',
        '$cookies',
        '$mdDialog',
        'boss.api.user',
        LoginCtrl
    ]);
});