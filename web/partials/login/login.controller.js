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
                $cookies.putObject('credential', {
                    account: loginInfo.account
                })
                $state.go('log.search');
            });
        };

        $scope.showAdvanced();
    }

    function LoginDialogCtrl($scope, $state, $timeout, $mdDialog, userApi) {

        $scope.loginFailed = false;
        $scope.loginInfo = {
            account: '',
            password: ''
        }

        $scope.login = function() {
            userApi.login($scope.loginInfo).$promise.then(function(result) {
                if (result.data) {
                    $mdDialog.hide($scope.loginInfo);
                } else {
                    $scope.loginFailed = true;
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