var express = require('express');
var utils = require('../utils.js');
var api = require('../api.js');
var router = express.Router();

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

router.post('/query', function(req, res) {
    console.log(req.body);
    api.boss.log.get(req.body, function(result) {        
        console.log(req.body);
        res.json(result);
    });
});

module.exports = router;