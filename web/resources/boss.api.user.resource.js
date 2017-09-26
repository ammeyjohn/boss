define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.user', function($resource) {
        return $resource('user', {}, {
            get: {
                method: 'GET',
                url: '/api/user'
            },
            getByAccount: {
                method: 'GET',
                url: '/api/user/:account',
                params: {
                    account: 'account'
                }
            },
            getByDept: {
                method: 'GET',
                url: '/api/user/department/:department',
                params: {
                    department: 'department'
                }
            }
        });
    });
});