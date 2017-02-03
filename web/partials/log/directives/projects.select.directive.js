define([
    'angular',
    'lodash',
    'boss.log',
    'boss.api.project'
], function(ng, _, logModule) {
    'use strict';


    logModule.directive('projectsSelect', function($rootScope) {

        var tmpl = `<ui-select multiple ng-model="vm.selectProjects" on-select="selectChanged()" on-remove="selectChanged()" theme="bootstrap" close-on-select="true">
                        <ui-select-match placeholder="请选择项目编号">{{$item.projectCode}}</ui-select-match>
                        <ui-select-choices 
                            repeat="project.projectCode as project in vm.searchProjects | propsFilter: {projectCode: $select.search, projectName: $select.search}" 
                            refresh="refreshProjects($select.search)" 
                            refresh-delay="100">
                            <div ng-bind-html="project.projectCode + ' ' + project.projectName | highlight: $select.search"></div>
                        </ui-select-choices>
                    </ui-select>`;

        return {
            restrict: 'AE',
            require: 'ngModel',
            template: tmpl,
            scope: {},
            controllerAs: 'vm',
            controller: [
                '$scope',
                '$cookies',
                'boss.api.project',
                function($scope, $cookies, prjApi) {
                    
                    var that = this;
                    var credential = $cookies.getObject('credential');

                    // 加载常用项目编号列表
                    var projects = null;
                    that.searchProjects = null;
                    prjApi.getByAccount({
                        account: credential.user.account
                    }).$promise.then(function(results) {
                        projects = results.data;
                        that.searchProjects = _.orderBy(_.take(projects, 50), ['projectCode'], ['desc']);
                    });

                    $scope.refreshProjects = function(searchText) {
                        if (searchText) {
                            var matches = _.filter(projects, function(prj) {
                                return prj.projectCode.indexOf(searchText) >= 0 ||
                                    prj.projectName.indexOf(searchText) >= 0;
                            });
                            that.searchProjects = _.orderBy(_.take(matches, 50), ['projectCode'], ['desc']);
                        }
                    }
                }
            ],
            link: function(scope, elem, attrs, model) {

                scope.selectChanged = function() {
                    model.$setViewValue(scope.selectProjects);
                }

                model.$render = function() {
                    scope.vm.selectProjects = model.$modelValue;
                }
            }
        };
    });
});