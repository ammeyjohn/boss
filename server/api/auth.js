var debug = require('debug')('boss:api:auth');
var util = require('util');
var _ = require('lodash');
var Q = require('q');
var utils = require('../utils');
var request = require('../request');
var userApi = require('../api/user');

// 用户登录
exports.login = function(account, password) {
    var defered = Q.defer();
    userApi.getUserByAccount(account)
        .then(function(user) {
            if (!user) {
                // 如果用户不存在则不进行登录验证
                defered.resolve({
                    code: 400,
                    message: util.format('用户账号"%s"未激活或不存在', account),
                    data: {
                        success: false,
                        loginTime: null,
                        user: null
                    }
                });
            } else {
                request.callplt('CheckPassword', {
                    'account': account,
                    'pws': password
                }, function(result) {
                    if (result.CheckPasswordResult) {
                        defered.resolve({
                            code: 0,
                            data: {
                                success: true,
                                loginTime: utils.now(),
                                user: user
                            }
                        });
                    } else {
                        defered.resolve({
                            code: 401,
                            message: '用户名或密码不正确',
                            data: {
                                success: false,
                                loginTime: null,
                                user: null,
                            }
                        });
                    }

                }, function(error) {
                    defered.reject(error);
                });
            }
        });
    return defered.promise;
}