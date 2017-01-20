var debug = require('debug')('boss:api:project');
var _ = require('lodash');
var Q = require('q');
var utils = require('../utils.js');
var request = require('../request.js');

var __projects = {};

// 根据用户账号获取项目列表
exports.getProjectsByAccount = function(account) {
    var defered = Q.defer();

    var projects = __projects[account];
    if (projects) {
        defered.resolve(projects);
    } else {
        request.call("P_GetProjectList", {
            "userAccount": account
        }, function(result) {
            var table = utils.getTable(result, "P_GetProjectListResult");
            var rows = [];
            _.each(table, function(row) {
                rows.push({
                    projectId: row.ProjectID,
                    projectCode: row.S_XiangMuBH,
                    projectName: row.S_XiangMuMC
                });
            });
            __projects[account] = rows;
            defered.resolve(rows);
        }, function(error){
            defered.reject(error);
        });
    }

    return defered.promise;
}