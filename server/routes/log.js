var debug = require('debug')('boss:router:log');
var express = require('express');
var util = require('util');
var utils = require('../utils.js');
var logApi = require('../api/log');
var deptApi = require('../api/department');
var router = express.Router();

router.post('/', function(req, res) {

    var log = req.body;
    debug(log);

    if (!log) {
        res.status(400).send({
            code: -1,
            data: null,
            message: '参数错误'
        });
    }

    deptApi.getDepartmentByAccount(log.account)
        .then(function(dept) {
            if (dept) {
                log.departmentId = dept;
                logApi.add(log).then(function(new_log) {
                        debug(new_log);
                        res.json({
                            code: 0,
                            data: new_log
                        });
                    },
                    function(error) {
                        res.status(500).send(error);
                    });
            } else {
                res.status(404).send({
                    code: -1,
                    data: null,
                    message: util.format('用户账号"%s"不存在', log.account)
                });
            }
        });
});

router.post('/query', function(req, res) {
    debug(req.body);
    logApi.query(req.body).then(function(logs) {
        debug(logs);
        res.json({
            code: 0,
            data: logs
        });
    }, function(error) {
        res.status(500).send(error);
    });
});

module.exports = router;