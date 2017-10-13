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

helper.insert = function(collection, item) {
    return connect().then(function(db) {
        var defered = Q.defer();
        var c = db.collection(collection);
        c.insert(item, function(err, docs) {
            debug(docs);
            if (!err) {
                defered.resolve(docs);
            } else {
                defered.reject(err);
            }
        });
        return defered.promise;
    });
}

helper.update = function(collection, condition, item) {
    return connect().then(function(db) {
        var defered = Q.defer();
        var c = db.collection(collection);
        c.update(condition, item, function(err, docs) {
            debug(docs);
            if (!err) {
                defered.resolve(docs);
            } else {
                defered.reject(err);
            }
        });
        return defered.promise;
    });
}

helper.delete = function(collection, condition) {
    return connect().then(function(db) {
        var defered = Q.defer();
        var c = db.collection(collection);
        c.deleteOne(condition, function(err, docs) {
            debug(docs);
            if (!err) {
                defered.resolve(docs);
            } else {
                defered.reject(err);
            }
        });
        return defered.promise;
    });
}

helper.query = function(collection, condition) {
    return connect().then(function(db) {
        var defered = Q.defer();
        var c = db.collection(collection);
        c.find(condition).toArray(function(err, docs) {
            debug(docs);
            if (!err) {
                defered.resolve(docs);
            } else {
                defered.reject(err);
            }
        });
        return defered.promise;
    });
}

helper.getNextSequence = function(name) {
    return connect().then(function(db) {
        var defered = Q.defer();
        var c = db.collection('sequence');
        c.findAndModify({ _id: name }, [], { $inc: { seq: 1 } }, { new: true },
            function(err, docs) {
                debug(doc);
                if (!err) {
                    defered.resolve(docs);
                } else {
                    defered.reject(err);
                }
            });
        return defered.promise;
    });
}

module.exports = helper;