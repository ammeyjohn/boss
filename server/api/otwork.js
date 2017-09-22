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
            D_DengJiSJ: moment().format('YYYY-MM-DDTHH:mm:ss'),
            I_DengJiRBM: otwork.departmentId,
            S_DengJiRAccount: otwork.account,
            S_DengJiIp: otwork.ip,
            S_MailTo: otwork.notifier,
            I_JLZT: 1,
            I_MealAllowanceNum: otwork.mealNum,
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
            cloned.otid = result.AddOTWorkResult;
            cloned.recordTime = entity.D_DengJiSJ;
            defered.resolve(cloned);
        });

    } else {
        defered.reject(null);
    }

    return defered.promise;
}