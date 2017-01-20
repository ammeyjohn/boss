var debug = require('debug')('boss:router:auth');
var express = require('express');
var authApi = require('../api/auth.js');

var router = express.Router();

router.post('/login', function(req, res) {
    debug(req.body);
    authApi.login(req.body.account, req.body.password)
        .then(function(credential) {
            debug(credential);
            if (credential.code === 0) {
                res.json(credential);
            } else {
                debug(credential);
                res.status(credential.code).send(credential);
            }

        }, function(error) {
            res.status(500).send(error);
        });
});

module.exports = router;