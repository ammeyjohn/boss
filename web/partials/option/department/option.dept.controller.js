define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.department',
    'metronic'
], function (ng, moment, _, settings, optionModule) {
    'use strict';

    function UserOptionCtrl($scope, $rootScope, $q, $cookies, $mdDialog, $mdToast, deptApi) {

        $scope.list = [{
                "id": 1,
                "title": "node1",
                "nodes": [{
                        "id": 11,
                        "title": "node1.1",
                        "nodes": [{
                            "id": 111,
                            "title": "node1.1.1",
                            "nodes": []
                        }]
                    },
                    {
                        "id": 12,
                        "title": "node1.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 2,
                "title": "node2",
                "nodrop": true,
                "nodes": [{
                        "id": 21,
                        "title": "node2.1",
                        "nodes": []
                    },
                    {
                        "id": 22,
                        "title": "node2.2",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 3,
                "title": "node3",
                "nodes": [{
                    "id": 31,
                    "title": "node3.1",
                    "nodes": []
                }]
            }
        ]

    }

    optionModule.controller('DeptOptionCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$cookies',
        '$mdDialog',
        '$mdToast',
        'boss.api.department',
        UserOptionCtrl
    ]);
});