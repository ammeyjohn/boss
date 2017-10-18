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
            },
            getById: {
                method: 'GET',
                url: '/api/department/:id',
                params: {
                    id: 'id'
                }
            },
            save: {
                method: 'POST',
                url: '/api/department',
                params: {
                    dept: '@dept'
                }
            },
            remove: {
                method: 'DELETE',
                url: '/api/department/:id',
                params: {
                    id: 'id'
                }
            }
        });
    });
});