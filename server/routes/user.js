var express = require('express');
var api = require('../api.js');
var router = express.Router();

router.get('/login', function(req, res) {
    api.boss.user.login(
        req.query.account,
        req.query.password,
        function(result) {            
            res.json(result);
        });
});

router.get('/ip', function(req, res) {
    api.boss.user.getIP(function(result) {
        res.json(result);
    });
});

router.get('/:user/department', function(req, res) {
    var user = req.params.user;
    api.boss.user.getDepartmentIdByUser(user, function(result) {
        res.json(result);
    });
});

module.exports = router;