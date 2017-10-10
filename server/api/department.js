var debug = require('debug')('boss:api:department');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var request = require('../request.js');
var mongo = require('../mongo.js');

// Defines mongodb collection name
var DEPARTMENTS = "departments";

// 获取部门列表
exports.getDepartments = function() {
    return mongo.query(DEPARTMENTS, null);
}

// 根据部门编号获取部门
exports.getDepartmentById = function(id) {
    return mongo.query(DEPARTMENTS, {
        id: id
    }).then(function(depts) {
        return _.head(depts);
    });
}

// 根据用户账号获取部门编号
exports.getDepartmentByAccount = function(account) {
    var defered = Q.defer();
    request.call('GetDepartmentIdByAccount', {
        'account': account
    }, function(result) {
        defered.resolve(result.GetDepartmentIdByAccountResult);
    }, function(error) {
        defered.reject(error);
    });
    return defered.promise;
}