var soap = require('soap');
var utils = require('./utils.js');

var boss = __dirname + "/wsdl/BossWebService.wsdl";
var platform = __dirname + "/wsdl/PlatformService.wsdl";

var request = function(wsdl, callback) {
    soap.createClient(wsdl, function(err, client) {
        if (!err) {
            client.setSecurity(new soap.BasicAuthSecurity('boss@shanghai3h.com', 'p@ss!'));
            callback(client);
        } else {
            console.error("Create client error");
            //console.error(err);
            //
            if (utils.checkFunction(callback)) {
                callback({
                    code: 500,
                    data: null,
                    error: err
                });
            }
        }
    });
}

var _call = function(wsdl, method, params, resolve, reject) {
    // console.log(method);
    // console.log(params);
    request(wsdl, function(client) {
        client[method](params, function(err, result) {
            if (!err) {
                resolve(result);
            } else {
                // console.error("Method call error");
                // console.error(err);
                reject(err)
            }
        });
    });
}

exports.call = function(method, params, resolve, reject) {
    if (!resolve) {
        resolve = function(result) {}
    }
    _call(boss, method, params, resolve, reject);
}

exports.callplt = function(method, params, resolve, reject) {
    if (!resolve) {
        resolve = function(result) {}
    }
    _call(platform, method, params, resolve, reject);
}