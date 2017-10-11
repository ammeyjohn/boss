define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.user',
    'boss.api.department'
], function(ng, moment, _, settings, optionModule) {
    'use strict';

    function OptionCtrl($scope, $rootScope, $q, $cookies, $mdSidenav, userApi, deptApi) {

        setTimeout(function() {
            $mdSidenav('user_prop').toggle();
        }, 5000);
    }

    optionModule.controller('OptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        '$mdSidenav',
        'boss.api.user',
        'boss.api.department',
        OptionCtrl
    ]);
});