var debug = require('debug')('boss:api:user');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var mongo = require('../mongo.js');

// defines mongodb collection name
var USERS = 'users';

// 获取用户列表
exports.getUsers = function() {
    return mongo.query(USERS, null);
}

// 获取指定账号的用户
exports.getUserByAccount = function(account) {
    return mongo.query(USERS, {
        account: account
    }).then(function(users) {
        return _.head(users);
    });
}

// 获取特定指定部门的用户
exports.getUsersByDeparment = function(department) {
    var departmentIds = _.map(_.split(department, ','), function(str) {
        return parseInt(str)
    });
    return mongo.query(USERS, {
        department: {
            $in: departmentIds
        }
    });
}

// 添加用户
exports.addUser = function(user) {
    var defered = Q.defer();
    mongo.getNextSequence('user_id')
        .then(function(id) {
            user.id = id.value.seq;
            mongo.insert(USERS, user)
                .then(function(res) {
                    defered.resolve(user);
                });
        });
    return defered.promise;
}

// 修改用户
exports.modifyUser = function(id, user) {
    delete user._id;
    return mongo.update(USERS, { id: id }, user);
}

// 删除用户
exports.removeUser = function(id) {
    return mongo.delete(USERS, { id: id });
}