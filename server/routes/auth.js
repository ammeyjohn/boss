var debug = require('debug')('boss:router:auth');
var express = require('express');
var authApi = require('../api/auth.js');

var router = express.Router();

router.post('/login', function(req, res) {
    authApi.login(req.body.account, req.body.password)
        .then(function(credential) {
            debug(credential);            
            res.json({
                code: credential.success ? 0 : -1,
                data: credential
            });
        }, function(error) {
            res.status(500).send(error);
        });
});

module.exports = router;