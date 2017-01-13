require([
    'angular',
    'moment',
    'lodash',
    './partials/index/index.module',
], function(ng, moment, _, indexModule) {
    'use strict';

    function IndexCtrl($scope, $rootScope, $state, $cookies) {

        // 监听窗体resize事件
        var resized;
        $(window).resize(function(event) {
            if (resized) {
                clearTimeout(resized);
            }
            resized = setTimeout(resize, 250);
        });

        var resize = function() {
            var height = $(window).height() - 84;
            $('.page-content').height(height);
        }

        resize();

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                var credential = $cookies.getObject('credential');
                if (!credential) {
                    if (toState.code !== 'LOGIN') {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });

        $scope.mouseMove = function(event) {
            console.log(event);
        }

        $scope.toolbarClick = function(name) {
            $rootScope.$broadcast(name);
        }

    }

    indexModule.controller('IndexCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$cookies',
        IndexCtrl
    ]);
});


// $scope.projects = [];
// $scope.projectName = null;

// userApi.getProjectByUser({
//     user: 'yuanjie'
// }).$promise.then(function(projects) {
//     $scope.projects = projects.data;
//     $scope.log.projectCode = $scope.projects[0].projectCode;
//     $scope.projectChanged();
// });

// $scope.log = {
//     logId: 0,
//     logType: 2,
//     logTime: moment().format('YYYY-MM-DD HH:mm:ss'),
//     recordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
//     taskTime: 0,            
//     projectCode: null,
//     content: null,
//     user: 'yuanjie'
// };

// $scope.projectChanged = function() {
//     var project = _.find($scope.projects, {
//         projectCode: $scope.log.projectCode
//     });
//     $scope.projectName = project.projectName;
// }

// $scope.save = function() {
//     userApi.add($scope.log).$promise.then(function(log) {
//         console.log(log);
//     });
// }