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
                    err: err
                });
            }
        }
    });
}

var _call = function(wsdl, method, params, callback) {
    console.log(method);
    console.log(params);
    request(wsdl, function(client) {    
        client[method](params, function(err, result) {
            if (!err) {
                callback(result);
            } else {
                console.error("Method call error");
                console.error(err);

                if (utils.checkFunction(callback)) {
                    callback({
                        code: 500,
                        data: null,
                        err: err
                    })
                }
            }
        });
    });
}

exports.call = function(method, params, callback) {
    _call(boss, method, params, callback);
}

exports.callplt = function(method, params, callback) {    
    _call(platform, method, params, callback);
}