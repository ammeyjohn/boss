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

    function OptionCtrl($scope, $rootScope, $q, $cookies) {

    }

    optionModule.controller('OptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        OptionCtrl
    ]);
});