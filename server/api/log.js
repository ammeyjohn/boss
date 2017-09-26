var debug = require('debug')('boss:api:log');
var util = require('util');
var _ = require('lodash');
var Q = require('q');
var moment = require("moment");
var utils = require('../utils');
var request = require('../request');

exports.add = function(log) {
    var defered = Q.defer();

    if (log) {

        var _log = {
            LogID: 0,
            S_XiangMuBH: log.projectCode,
            S_LogComment: log.content,
            I_LogType: log.logType,
            I_LogGongShi: log.taskTime,
            D_DengJiSJ: moment().format('YYYY-MM-DDTHH:mm:ss'),
            D_RiZhiSJ: moment(log.logTime).format('YYYY-MM-DDTHH:mm:ss'),
            I_DengJiBM: log.departmentId,
            S_DengJiRAccount: log.account,
            S_DengJiIP: log.ip,
            I_JiaBanBH: null,
            I_WeiHuBH: null,
            I_ChuChaiBH: null,
            I_ChengBenGS: log.departmentId
        };
        debug(_log);

        request.call("InsertOrUpdateLog", {
            "_Log": _log
        }, function(result) {
            log.logId = result.InsertOrUpdateLogResult;
            log.recordTime = _log.D_DengJiSJ;
            debug(log);
            defered.resolve(log);
        }, function(error) {
            defered.reject(error);
        });

    } else {
        defered.reject(null);
    }

    return defered.promise;
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
    condition.logEndTime = moment(condition.logEndTime).add(1, 'days').format('YYYY-MM-DD');

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
    clause += " and D_RiZhiSJ<='" + utils.formatDate(condition.logEndTime) + "'";
    if (condition.recordStartTime) {
        clause += " and D_DengJiSJ>='" + condition.recordStartTime + "'";
    }
    if (condition.recordEndTime) {
        clause += " and D_DengJiSJ<='" + condition.recordEndTime + "'";
    }
    clause += utils.convertArrayToWhereClause(condition.users, 'S_DengJiRAccount', true);
    clause += utils.convertArrayToWhereClause(condition.projectCode, 'S_XiangMuBH', true);
    clause += utils.convertArrayToWhereClause(condition.logType, 'I_LogType', false);
    clause += utils.convertArrayToWhereClause(condition.departments, 'I_DengJiBM', false);
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
                workTime: parseInt(row.I_LogGongShi),
                recordTime: row.D_DengJiSJ,
                recordUser: row.S_DengJiRAccount,
                department: row.S_DengJiBM,
                userName: row.UserName
            });
        });
        debug(rows);
        defered.resolve(rows);
    }, function(error) {
        defered.reject(error);
    });

    return defered.promise;
}