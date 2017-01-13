var _ = require('lodash');
var moment = require("moment");
var utils = require('./utils.js');
var request = require('./request.js');

exports.boss = {
    user: {
        /* 用户登录 */
        login: function(account, password, callback) {
            request.callplt("CheckPassword", {
                "account": account,
                "pws": password
            }, function(result) {
                if (utils.checkFunction(callback)) {
                    callback({
                        code: 0,
                        data: result.CheckPasswordResult
                    });
                }
            });
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
            console.log(_log);

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
            if (condition.user) {
                clause += " and S_DengJiRAccount='" + condition.user + "'";
            }
            if (condition.projectCode) {
                clause += " and S_XiangMuBH='" + condition.projectCode + "'";
            }
            if (condition.logType) {
                clause += " and I_LogType=" + condition.logType;
            }
            if (condition.departmentId) {
                clause += " and I_DengJiBM=" + condition.departmentId;
            }
            if (condition.recordStartTime) {
                clause += " and D_DengJiSJ>='" + condition.recordStartTime + "'";
            }
            if (condition.recordEndTime) {
                clause += " and D_DengJiSJ<'" + condition.recordEndTime + "'";
            }
            console.log(clause);
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
                            Department: row.S_DengJiBM,
                            UserName: row.UserName
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