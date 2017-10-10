var debug = require('debug')('boss:api:user');
var path = require('path');
var _ = require('lodash');
var Q = require('q');
var settings = require('../settings.js');
var mongo = require('mongodb').MongoClient;
var deptApi = require('./department.js');

// 获取用户列表
exports.getUsers = function() {
    var defered = Q.defer();
    try {
        mongo.connect(settings.DB_ADDR, function(err, db) {
            console.log("Connected correctly to server", settings.DB_ADDR);

            var collection = db.collection('users');
            collection.find().toArray(function(err, docs) {
                defered.resolve(docs);
            });

            db.close();
        });
    } catch (err) {
        console.error(err);
        defered.reject(err);
    }
    return defered.promise;
}

// 获取指定账号的用户
exports.getUserByAccount = function(account) {
    var defered = Q.defer();
    try {
        mongo.connect(settings.DB_ADDR, function(err, db) {
            console.log("Connected correctly to server", settings.DB_ADDR);

            var collection = db.collection('users');
            collection.find({
                account: account
            }).toArray(function(err, docs) {
                defered.resolve(docs);
            });

            db.close();
        });
    } catch (err) {
        console.error(err);
        defered.reject(err);
    }
    return defered.promise;
}

// 获取特定指定部门的用户
exports.getUsersByDeparment = function(department) {
    var departmentIds = _.map(_.split(department, ','), parseInt);    

    var defered = Q.defer();
    try {
        mongo.connect(settings.DB_ADDR, function(err, db) {
            console.log("Connected correctly to server", settings.DB_ADDR);

            var collection = db.collection('users');
            collection.find({
                department: {
                    $in: departmentIds
                }
            }).toArray(function(err, docs) {
                defered.resolve(docs);
            });

            db.close();
        });
    } catch (err) {
        console.error(err);
        defered.reject(err);
    }
    return defered.promise;
}