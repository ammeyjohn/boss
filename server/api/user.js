var debug = require('debug')('boss:api:user');
var path = require('path');
var fs = require("fs");
var _ = require('lodash');
var Q = require('q');

const file = path.join(__dirname, '../data/users.json');
var __users = null;

// 获取用户列表
exports.getUsers = function() {
    var defered = Q.defer();
    if (__users !== null) {
        defered.resolve(__users);
    } else {
        fs.readFile(file, function(err, data) {
            if (err) {
                debug('%O', err);
                defered.resolve(null);
            }
            __users = JSON.parse(data.toString());
            defered.resolve(__users);
        });
    }
    return defered.promise;
}

// 获取指定账号的用户
exports.getUserByAccount = function(account) {
    return exports.getUsers().then(function(users) {
        return _.find(users, {
            'account': account
        }) || null;
    });
}

// 获取特定指定部门的用户
exports.getUsersByDeparment = function(department) {
    return exports.getUsers().then(function(users) {
        return _.filter(users, {
            'department': department
        });
    });
}