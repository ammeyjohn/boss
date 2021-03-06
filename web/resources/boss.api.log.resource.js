define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.log', function($resource) {
        return $resource('log', {}, {
            add: {
                method: 'POST',
                url: '/api/log',
                params: {
                    log: '@log'
                }
            },
            queryLogs: {
                method: 'POST',
                url: '/api/log/query',
                params: {
                    condition: '@condition'
                }
            }
        });
    });
});