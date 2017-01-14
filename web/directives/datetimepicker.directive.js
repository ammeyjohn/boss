define([
    'angular',
    'moment',
    'datetimepicker',
    'css!datetimepicker-css'
], function(ng, moment) {
    'use strict';

    var datetimepicker = function($rootScope) {
        return {
            require: '?ngModel',
            restrict: 'AE',
            scope: {
                format: '@',
                showClear: '@'
            },
            link: function(scope, elem, attrs, model) {

                var option = {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    useCurrent: true,
                    showClear: false
                }

                if (scope.format) {
                    option.format = scope.format;
                }

                if (scope.showClear) {
                    option.showClear = (scope.showClear == 'true');
                }

                elem.datetimepicker(option)
                    .on('dp.change', function(e) {
                        if (model) {
                            if (model.$validators.required) {
                                if (!e.date) {
                                    model.$setValidity('required', false);
                                }
                            }

                            model.$setDirty();

                            if (!e.date) {
                                model.$setViewValue(null);
                            } else {
                                if (!moment(model.$modelValue).isSame(e.date)) {
                                    model.$setViewValue(moment(e.date).format(option.format));
                                }
                            }
                        }
                    });

                if (model) {

                    // if (model.$validators.required) {
                    //     model.$parsers.push(function(value) {
                    //         if (model.$isEmpty()) {
                    //             model.$setValidity('required', false);
                    //         }
                    //         return value;
                    //     });
                    // }

                    model.$render = function() {
                        elem.data('DateTimePicker').date(model.$viewValue);
                    }
                }
            }
        };
    }

    var module = angular.module('datetimepicker', []);
    module.directive('datetimepicker', datetimepicker);
    return module;
});