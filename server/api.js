var _ = require('lodash');
var moment = require("moment");
var utils = require('./utils.js');
var request = require('./request.js');

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

exports.boss = {
    user: {
        /* 用户登录 */
        login: function(account, password, callback) {

            var user = _.find(global.users, {
                account: account
            });

            var data = {
                success: false,
                loginTime: null,
                user: null
            };

            if (!user) {
                callback({
                    code: -1,
                    error: {
                        message: '无法找到用户"' + account + '"。'
                    },
                    data: data
                });
            } else {
                request.callplt("CheckPassword", {
                    "account": account,
                    "pws": password
                }, function(result) {
                    if (result.CheckPasswordResult) {
                        data.success = true;
                        data.loginTime = utils.now();
                        data.user = user;

                        callback({
                            code: 0,
                            data: data
                        });
                    } else {
                        callback({
                            code: -1,
                            data: data,
                            error: {
                                message: '用户名或密码不正确。'
                            }
                        });
                    }
                }, function(error) {
                    callback({
                        code: -1,
                        data: data,
                        error: error
                    });
                });
            }
        },

        /* 获得当前用户IP地址 */
        getIP: function(callback) {
            request.call("GetCustomerIP", null, function(result) {
                if (utils.checkFunction(callback)) {
                    callback({
                        code: 0,
                        data: result.GetCustomerIPResult
                    });
                }
            });
        },

        /* 获取指定用户所在的部门编号 */
        getDepartmentIdByUser: function(user, callback) {
            request.call("GetDepartmentIdByAccount", {
                "account": user
            }, function(result) {
                if (utils.checkFunction(callback)) {
                    callback({
                        code: 0,
                        data: result.GetDepartmentIdByAccountResult
                    });
                }
            });
        }
    },
    project: {
        /* 根据用户名获取常用项目列表 */
        getByUser: function(user, callback) {
            request.call("P_GetProjectList", {
                "userAccount": user
            }, function(result) {
                if (utils.checkFunction(callback)) {
                    var table = utils.getTable(result, "P_GetProjectListResult");
                    var rows = [];
                    _.each(table, function(row) {
                        rows.push({
                            projectId: row.ProjectID,
                            projectCode: row.S_XiangMuBH,
                            projectName: row.S_XiangMuMC
                        });
                    });
                    callback({
                        code: 0,
                        data: rows
                    });
                }
            });
        }
    },
    log: {
        /* 添加日志 */
        add: function(log, callback) {
            var _log = {
                LogID: 0,
                S_XiangMuBH: log.projectCode,
                S_LogComment: log.content,
                I_LogType: log.logType,
                I_LogGongShi: log.taskTime,
                D_DengJiSJ: moment().format('YYYY-MM-DDTHH:mm:ss'),
                D_RiZhiSJ: moment(log.logTime).format('YYYY-MM-DDTHH:mm:ss'),
                I_DengJiBM: log.departmentId,
                S_DengJiRAccount: log.user,
                S_DengJiIP: log.ip,
                I_JiaBanBH: null,
                I_WeiHuBH: null,
                I_ChuChaiBH: null,
                I_ChengBenGS: log.departmentId
            };
            //console.log(_log);

            request.call("InsertOrUpdateLog", {
                "_Log": _log
            }, function(result) {
                if (utils.checkFunction(callback)) {
                    var ret = _.cloneDeep(log);
                    ret.logId = result.InsertOrUpdateLogResult;
                    ret.recordTime = _log.D_DengJiSJ;
                    callback(ret);
                }
            });
        },

        /* 查询日志记录并以简略格式返回 */
        get: function(condition, callback) {            
            if (!condition.logStartTime) {
                condition.logStartTime = utils.formatDate(moment().subtract(7, 'days'));
            }
            if (!condition.logEndTime) {
                condition.logEndTime = utils.formatDate(moment());
            }

            var clause = "";
            clause += "D_RiZhiSJ>='" + utils.formatDate(condition.logStartTime) + "'";
            clause += " and D_RiZhiSJ<'" + utils.formatDate(condition.logEndTime) + "'";
            clause += convertArrayToWhereClause(condition.users, 'S_DengJiRAccount', true);
            clause += convertArrayToWhereClause(condition.projectCode, 'S_XiangMuBH', true);
            clause += convertArrayToWhereClause(condition.logType, 'I_LogType', true);
            if (condition.departmentId) {
                clause += " and I_DengJiBM=" + condition.departmentId;
            }
            if (condition.recordStartTime) {
                clause += " and D_DengJiSJ>='" + condition.recordStartTime + "'";
            }
            if (condition.recordEndTime) {
                clause += " and D_DengJiSJ<'" + condition.recordEndTime + "'";
            }
            //console.log(clause);
            request.call("SelectLogView", {
                "filter": clause
            }, function(result) {
                if (utils.checkFunction(callback)) {                    
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
                    callback({
                        code: 0,
                        data: rows
                    });
                }
            });
        }
    }
}