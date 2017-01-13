define([
    'angular',
    'angular-resource'
], function(ng) {
    'use strict';

    var apiModule = ng.module('boss.api', [
        'ngResource'
    ]);

    apiModule
        .config(['$provide',
            function($provide) {
                apiModule.factory = $provide.factory;
            }
        ]);

    return apiModule;
});