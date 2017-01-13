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
                format: '@'
            },
            link: function(scope, elem, attrs, model) {

                var option = {
                    format: 'YYYY-MM-DD HH:mm:ss',
                    useCurrent: true
                }

                if (scope.format) {
                    option.format = scope.format;
                }

                elem.datetimepicker(option)
                    .on('dp.change', function(e) {
                        if (model) {
                            if (!e.date) {
                                model.$setDirty();
                                model.$setViewValue(null);

                                if (model.$validators.required) {
                                    model.$setValidity('required', false);
                                }
                            } else {
                                if (!moment(model.$modelValue).isSame(e.date)) {
                                    model.$setDirty();
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
                        if (model.$viewValue) {
                            elem.data('DateTimePicker').date(model.$viewValue);
                        }
                    }
                }
            }
        };
    }

    var module = angular.module('datetimepicker', []);
    module.directive('datetimepicker', datetimepicker);
    return module;
});