var debug = require('debug')('boss:router:log');
var express = require('express');
var utils = require('../utils.js');
var logApi = require('../api/log');
var router = express.Router();

// router.post('/', function(req, res) {
//     if (!req.body) {
//         res.sendStatus(404);
//     }

//     var log = req.body
//     log.ip = utils.getClientIpAddr(req);

//     api.boss.user.getDepartmentIdByUser(log.user, function(result) {
//         log.departmentId = result.data;

//         //console.log(log);
//         api.boss.log.add(log, function(result) {
//             res.json({
//                 data: result
//             });
//         });
//     });
// });

router.post('/query', function(req, res) {
    debug(req.body);
    logApi.query(req.body).then(function(logs) {
        debug(logs);
        res.json({
            code: 0,
            data: logs
        });
    }, function(error){
        res.status(500).send(error);
    });
});

module.exports = router;