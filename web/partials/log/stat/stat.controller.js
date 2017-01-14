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

    function StatCtrl($scope, $rootScope, $cookies, $mdToast, $mdDialog, prjApi, logApi) {

     
    }

    logModule.controller('LogEditorCtrl', [
        '$scope',
        '$rootScope',
        '$cookies',
        '$mdToast',
        '$mdDialog',
        'boss.api.project',
        'boss.api.log',
        StatCtrl
    ]);
});