var debug = require('debug')('boss:api:log');
var util = require('util');
var _ = require('lodash');
var Q = require('q');
var moment = require("moment");
var utils = require('../utils');
var request = require('../request');
var userApi = require('../api/user');

var convertArrayToWhereClause = function(array, field, withQuotes) {
    var clause = '';
    if (array && array.length > 0) {
        var quotes = withQuotes ? "'" : "";
        if (array.length === 1) {
            clause = ' and ' + field + '=' + quotes + array[0] + quotes;
        } else {
            _.each(array, function(item) {
                clause += ',' + quotes + item + quotes;
            });
            clause = ' and ' + field + ' in (' + clause.substring(1) + ')';
        }
    }
    return clause;
}

exports.query = function(condition) {
    var defered = Q.defer();

    // 如果日志时间和填写时间都未填写则需要显示日志时间
    if (!condition.logStartTime &&
        !condition.recordStartTime) {
        condition.logStartTime = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (!condition.logEndTime &&
        !condition.recordEndTime) {
        condition.logEndTime = moment().endOf('month').format('YYYY-MM-DD');
    }

    // 处理部门查询条件
    if (condition.departments &&
        condition.departments.length > 0) {

        // 查询所有编号小于0的部门
        var negtive = _.filter(condition.departments, function(dept) {
            return dept < 0
        });

        if (negtive.length > 0) {
            _.each(negtive, function(dept) {
                _.each(_.filter(global.users, {
                    department: dept
                }), function(user) {
                    condition.users.push(user.account)
                });
                condition.departments = _.without(condition.departments, dept);
            });
            condition.users = _.uniq(condition.users)
        }
    }

    // 生成查询语句
    var clause = "";
    clause += "D_RiZhiSJ>='" + utils.formatDate(condition.logStartTime) + "'";
    clause += " and D_RiZhiSJ<'" + utils.formatDate(condition.logEndTime) + "'";
    if (condition.recordStartTime) {
        clause += " and D_DengJiSJ>='" + condition.recordStartTime + "'";
    }
    if (condition.recordEndTime) {
        clause += " and D_DengJiSJ<'" + condition.recordEndTime + "'";
    }
    clause += convertArrayToWhereClause(condition.users, 'S_DengJiRAccount', true);
    clause += convertArrayToWhereClause(condition.projectCode, 'S_XiangMuBH', true);
    clause += convertArrayToWhereClause(condition.logType, 'I_LogType', false);
    clause += convertArrayToWhereClause(condition.departments, 'I_DengJiBM', false);
    debug(clause);

    request.call("SelectLogView", {
        "filter": clause
    }, function(result) {
        var table = utils.getTable(result, "SelectLogViewResult");
        var rows = [];
        _.each(table, function(row) {
            rows.push({
                logId: row.LogID,
                logType: row.S_LogType,
                logTime: row.D_RiZhiSJ,
                content: row.S_LogComment,
                projectCode: row.S_XiangMuBH,
                projectName: row.S_XiangMuMC,
                workTime: row.I_LogGongShi,
                recordTime: row.D_DengJiSJ,
                recordUser: row.S_DengJiRAccount,
                department: row.S_DengJiBM,
                userName: row.UserName
            });
        });
        defered.resolve(rows);
    }, function(error) {
        defered.reject(error);
    });

    return defered.promise;
}