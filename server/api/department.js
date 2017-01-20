var debug = require('debug')('boss:api:department');
var path = require('path');
var fs = require("fs");
var _ = require('lodash');
var Q = require('q');
var utils = require('../utils.js');
var request = require('../request.js');

const file = path.join(__dirname, '../data/departments.json');
var __departments = null;

// 获取部门列表
exports.getDepartments = function() {
    var defered = Q.defer();
    if (__departments !== null) {
        defered.resolve(__departments);
    } else {
        fs.readFile(file, function(err, data) {
            if (err) {
                debug('%O', err);
                defered.resolve(null);
            }
            __departments = JSON.parse(data.toString());
            defered.resolve(__departments);
        });
    }
    return defered.promise;
}

// 根据部门编号获取部门
exports.getDepartmentsById = function(id) {
    return exports.getDepartments().then(function(departments){
        return _.find(departments, id);        
    })
}