var express = require('express');
var utils = require('../utils.js');
var api = require('../api.js');
var router = express.Router();

router.get('/', function(req, res) {
    var condition = {
        logStartTime: req.query.logStartTime,
        logEndTime: req.query.logEndTime,
        user: req.query.user,
        logType: req.query.logType,
        projectCode: req.query.projectCode
    }
    console.log(condition);
    api.boss.log.get(condition, function(result) {
        res.json(result);
    });
});

router.post('/', function(req, res) {
    if (!req.body) {
        res.sendStatus(404);
    }

    var log = req.body
    log.ip = utils.getClientIpAddr(req);

    api.boss.user.getDepartmentIdByUser(log.user, function(result) {
        log.departmentId = result.data;

        console.log(log);
        api.boss.log.add(log, function(result) {
            res.json({
                data: result
            });
        });
    });
});

module.exports = router;