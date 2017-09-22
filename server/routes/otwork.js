var debug = require('debug')('boss:router:otwork');
var express = require('express');
var utils = require('../utils');
var otApi = require('../api/otwork');
var deptApi = require('../api/department');

var router = express.Router();

router.post('/', function(req, res) {

    var otwork = req.body;
    debug(otwork);

    if (!otwork) {
        res.status(400).send({
            code: -1,
            data: null,
            message: '参数错误'
        });
    }

    deptApi.getDepartmentByAccount(otwork.account)
        .then(function(dept) {
            if (dept) {

                otwork.departmentId = dept;
                otwork.ip = utils.getClientIpAddr(req);
                otApi.add(otwork).then(function(new_otwork) {

                        // 发送加班确认邮件
                        otApi.sendMail(new_otwork.id, new_otwork.notifier);

                        res.json({
                            code: 0,
                            data: new_otwork
                        });
                    },
                    function(error) {
                        res.status(500).send(error);
                    });
            } else {
                res.status(404).send({
                    code: -1,
                    data: null,
                    message: util.format('用户账号"%s"未激活或不存在', otwork.account)
                });
            }
        });

});

module.exports = router;