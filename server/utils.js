var _ = require("lodash");
var moment = require("moment");

var utils = {
    checkFunction: function(func) {
        return func && _.isFunction(func);
    },

    getTable: function(result, name) {
        var id = result[name].schema.attributes.id;
        if (id) {
            var temp = result[name];
            if (temp && temp.diffgram) {
                temp = temp.diffgram[id].Table;
                return temp;
            }
        }
        return null;
    },

    getClientIpAddr: function(req) {
        var ip = req.ip;
        if (ip) {
            var ipParts = ip.split(':');
            if (ipParts.length == 4) {
                return ipParts[3];
            }
        }
        return '::1';
    },

    formatDate: function(date) {
        return moment(date).format("YYYY-MM-DD");
    },

    formatTime: function(time) {
        return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },

    now: function() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
    },

    today: function() {
        return moment().format("YYYY-MM-DD");
    }
}

_.each(utils, function(value, key) {
    exports[key] = value;
});