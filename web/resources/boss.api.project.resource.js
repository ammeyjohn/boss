define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.project', function($resource) {
        return $resource('project', {}, {           
            getProjectByUser: {
                method: 'GET',
                url: '/api/project/:user',
                params: {
                    user: '@user'
                }
            }
        });
    });
});