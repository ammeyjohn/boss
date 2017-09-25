define([
    'angular',
    'lodash',
    'boss.login',
    'boss.api.user',
    'boss.api.department',
    'boss.api.auth'
], function(ng, _, loginModule) {
    'use strict';

    function LoginCtrl($scope, $rootScope, $state, $cookies, $mdDialog, userApi, deptApi, authApi) {

        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: LoginDialogCtrl,
                templateUrl: 'partials/login/login.tmpl.html',
                parent: angular.element(document.body),
                locals: {
                    'userApi': userApi,
                    'authApi': authApi
                },
                targetEvent: ev,
                escapeToClose: false,
                clickOutsideToClose: false,
                fullscreen: true
            }).then(function(credential) {
                deptApi.getById({ 'id': credential.user.department }).$promise
                    .then(function(department) {
                        credential.department = department.data;
                        $cookies.putObject('credential', credential);
                        $rootScope.$broadcast('BOSS_USER_LOGIN', credential);
                        $state.go('log.analyze');
                    });
            });
        };

        $scope.showAdvanced();
    }

    function LoginDialogCtrl($scope, $state, $mdDialog, userApi, authApi) {

        $scope.loginInfo = {
            account: null,
            password: null
        }
        $scope.errorMessage = '';

        $scope.login = function() {
            if (!$scope.loginInfo.account || !$scope.loginInfo.password) {
                $scope.errorMessage = '请先输入用户名和密码。';
                return;
            }

            $scope.loginning = true;
            authApi.login($scope.loginInfo).$promise
                .then(function(result) {
                    if (result.data && result.data.success) {
                        $mdDialog.hide(result.data);
                    } else {
                        $scope.errorMessage = result.message;
                    }
                    $scope.loginning = false;
                }, function(error) {
                    $scope.errorMessage = error.data.message;
                    $scope.loginning = false;
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
        '$rootScope',
        '$state',
        '$cookies',
        '$mdDialog',
        'boss.api.user',
        'boss.api.department',
        'boss.api.auth',
        LoginCtrl
    ]);
});