var debug = require('debug')('boss:api:otwork');
var util = require('util');
var _ = require('lodash');
var Q = require('q');
var moment = require("moment");
var utils = require('../utils');
var request = require('../request');

/* 添加加班记录 */
exports.add = function(otwork) {
    var defered = Q.defer();

    if (otwork) {
        var entity = {
            OTID: 0,
            S_JiaBanComment: otwork.content,
            D_JiaBanKaiShiSJ: moment(otwork.startTime).format('YYYY-MM-DDTHH:mm:ss'),
            D_JiaBanJieShuSJ: moment(otwork.endTime).format('YYYY-MM-DDTHH:mm:ss'),
            // D_DengJiSJ: moment().format('YYYY-MM-DDTHH:mm:ss'),
            D_DengJiSJ: moment(otwork.endTime).format('YYYY-MM-DDTHH:mm:ss'),
            I_DengJiRBM: otwork.departmentId,
            S_DengJiRAccount: otwork.account,
            S_DengJiIp: otwork.ip,
            S_MailTo: otwork.notifier,
            I_JLZT: 1,
            I_MealAllowanceNum: otwork.mealCount,
            I_Remark1: null,
            I_Remark2: null,
            I_Remark3: null,
            I_Remark4: null,
            I_Remark5: null,
            D_Remark1: null,
            D_Remark2: null,
            D_Remark3: null,
            C_Remark1: null,
            C_Remark2: '1.4.5.4',
            C_Remark3: '正常'
        }
        debug(entity);

        request.call("AddOTWork", {
            "ot": entity
        }, function(result) {
            var cloned = _.cloneDeep(otwork);
            cloned.id = result.AddOTWorkResult;
            cloned.recordTime = entity.D_DengJiSJ;
            defered.resolve(cloned);
        });

    } else {
        defered.reject(null);
    }

    return defered.promise;
}

/* 发送加班确认邮件 */
exports.sendMail = function(id, notifier) {
    request.call("SendOTConfirmdEmail", {
        "otID": id,
        "emailTo": notifier
    }, function(result) {});
}

/* 查询加班记录 */
exports.query = function(condition) {
    var defered = Q.defer();

    if (!condition.recordStartTime) {
        condition.recordStartTime = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (!condition.recordEndTime) {
        condition.recordEndTime = moment().endOf('month').format('YYYY-MM-DD');
    }
    condition.logEndTime = moment(condition.recordEndTime).add(1, 'days').format('YYYY-MM-DD');

    // 生成查询语句
    var clause = "";
    clause += " and I_JLZT=1";
    clause += " and D_DengJiSJ>='" + utils.formatDate(condition.recordStartTime) + "'";
    clause += " and D_DengJiSJ<='" + utils.formatDate(condition.recordEndTime) + "'";
    clause += utils.convertArrayToWhereClause(condition.departments, 'I_DengJiRBM', false);
    debug(clause);
    console.log(clause)

    request.call("SelectOTWork", {
        "where": clause,
        "order": " OTID DESC"
    }, function(result) {
        var table = utils.getTable(result, "SelectOTWorkResult");
        var rows = [];
        _.each(table, function(row) {
            rows.push({
                id: row.OTID,
                content: row.S_JiaBanComment,
                startTime: row.D_JiaBanKaiShiSJ,
                endTime: row.D_JiaBanJieShuSJ,
                recordTime: row.D_DengJiSJ,
                duration: moment(row.D_JiaBanJieShuSJ).diff(moment(row.D_JiaBanKaiShiSJ), 'minutes'),
                departmentId: row.I_DengJiRBM,
                account: row.S_DengJiRAccount,
                mealCount: row.I_MealAllowanceNum
            });
        });
        debug(rows);
        defered.resolve(rows);
    }, function(error) {
        defered.reject(error);
    });

    return defered.promise;
}