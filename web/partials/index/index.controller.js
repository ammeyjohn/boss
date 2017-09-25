require([
    'angular',
    'moment',
    'lodash',
    './partials/index/index.module',
    'css!partials/index/style'
], function(ng, moment, _, indexModule) {
    'use strict';

    function IndexCtrl($scope, $rootScope, $state, $location, $cookies) {

        $scope.credential = $cookies.getObject('credential');

        // 监听窗体resize事件
        var resized;
        $(window).resize(function(event) {
            if (resized) {
                clearTimeout(resized);
            }
            resized = setTimeout(resize, 250);
        });

        var resize = function() {
            var size = {
                width: $(window).width(),
                height: $(window).height() - 84
            }
            $('.boss-page-content').height(size.height);
            $rootScope.$broadcast("BOSS_WINDOWS_RESIZED", size);
        }

        resize();

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                var credential = $cookies.getObject('credential');
                if (toState.code !== 'LOGIN') {
                    if (!credential) {
                        event.preventDefault();
                        $state.go('login');
                    }
                } else {
                    if (credential) {
                        event.preventDefault();
                        $state.go('log.analyze');
                    }
                }
            });

        if ($location.url() === '/') {
            $state.go('login');
        }

        $scope.$on('BOSS_USER_LOGIN', function(evt, loginInfo) {
            $scope.credential = loginInfo;
        });

        $scope.authorize = function(roles) {
            var authorized = false;
            if ($scope.credential) {
                authorized = (_.intersection($scope.credential.user.roles, roles).length > 0);
            }
            return authorized;
        }

        $scope.mouseMove = function(event) {
            console.log(event);
        }

        $scope.toolbarClick = function(name) {
            $rootScope.$broadcast(name);
        }

        $scope.goto = function(name, params) {
            $state.go(name, params);
        }

        $scope.logout = function() {
            $cookies.remove('credential');
            $state.go('login');
        }
    }

    indexModule.controller('IndexCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$location',
        '$cookies',
        IndexCtrl
    ]);
});