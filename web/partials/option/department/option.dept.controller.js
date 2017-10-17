define([
    'angular',
    'moment',
    'lodash',
    'settings',
    'boss.option',
    'boss.api.department',
    'metronic'
], function(ng, moment, _, settings, optionModule) {
    'use strict';

    function UserOptionCtrl($scope, $rootScope, $q, $cookies, $mdDialog, $mdToast, deptApi) {

        $scope.depts = [];

        $scope.click = function(node) {
            console.log(node);
        }

        (function() {
            deptApi.get().$promise
                .then(function(depts) {
                    $scope.depts = buildTree(depts.data);
                });

            var buildTree = function(depts) {
                var nodes = [];
                _.each(depts, function(dept) {
                    var node = {
                        id: dept.id,
                        pId: parseInt(dept.parent),
                        name: dept.name,
                        open: true,
                        click: data: dept
                    }
                    nodes.push(node);
                });

                return nodes;
            }
        })();
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