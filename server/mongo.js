var debug = require('debug')('boss:mongo');
var Q = require('q');
var settings = require('./settings.js');
var mongo = require('mongodb').MongoClient;

var helper = {};

var connect = function() {
    var defered = Q.defer();
    try {
        mongo.connect(settings.DB_ADDR, function(err, db) {
            debug('Connected correctly to server ' + settings.DB_ADDR);
            if (!err) {
                defered.resolve(db);
            } else {
                defered.reject(err);
            }
        });
    } catch (err) {
        debug(err);
        defered.reject(err);
    }
    return defered.promise;
}

helper.query = function(collection, condition) {
    return connect().then(function(db) {
        var defered = Q.defer();
        var c = db.collection(collection);
        c.find(condition).toArray(function(err, docs) {
            debug(docs);
            defered.resolve(docs);
        });
        return defered.promise;
    });
}

module.exports = helper;