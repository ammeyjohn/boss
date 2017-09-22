define([
    'angular',
    'boss.api'
], function(ng, apiModule) {
    'use strict';

    apiModule.factory('boss.api.otwork', function($resource) {
        return $resource('otwork', {}, {
            add: {
                method: 'POST',
                url: '/api/otwork',
                params: {
                    otwork: '@otwork'
                }
            }
        });
    });
});