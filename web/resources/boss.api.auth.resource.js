define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.auth', function($resource) {
        return $resource('auth', {}, {
            login: {
                method: 'POST',
                url: '/api/login'
            }
        });
    });
});