var debug = require('debug')('boss:router:user');
var express = require('express');
var userApi = require('../api/user.js');

var router = express.Router();

router.get('/', function(req, res) {
    userApi.getUsers().then(function(users) {
        debug(users);
        res.json({
            code: 0,
            data: users
        });
    });
});

router.get('/:account', function(req, res) {
    var account = req.params.account;
    debug('params:account=%s', account);
    userApi.getUserByAccount(account).then(function(user) {
        console.log(user);
        res.json({
            code: 0,
            data: user
        });
    });
});


router.get('/department/:department', function(req, res) {
    var department = req.params.department;
    debug('params:department=%s', department);
    userApi.getUsersByDeparment(department)
        .then(function(users) {
            debug(users);
            res.json({
                code: 0,
                data: users
            });
        });
});

module.exports = router;