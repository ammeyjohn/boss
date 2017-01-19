define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.user', function($resource) {
        return $resource('user', {}, {
            login: {
                method: 'GET',
                url: '/api/user/login',
                params: {
                    account: 'account',
                    password: 'password'
                }
            },
            getAll: {
                method: 'GET',
                url: '/api/user'
            },
            getIP: {
                method: 'GET',
                url: '/api/user/ip'
            }
        });
    });
});