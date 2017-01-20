define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.project', function($resource) {
        return $resource('project', {}, {           
            getByAccount: {
                method: 'GET',
                url: '/api/project/user/:account',
                params: {
                    account: '@account'
                }
            }
        });
    });
});