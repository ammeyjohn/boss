define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.department', function($resource) {
        return $resource('department', {}, {
            get: {
                method: 'GET',
                url: '/api/department'
            }
        });
    });
});