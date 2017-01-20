var debug = require('debug')('boss:router:project');
var express = require('express');
var prjApi = require('../api/project');
var router = express.Router();

router.get('/user/:account', function(req, res) {
    var account = req.params.account;
    prjApi.getProjectsByAccount(account).then(function(projects) {
        debug(projects);
        res.json({
            code: 0,
            data: projects
        });
    }, function(error) {
        res.status(500).send(error);
    });
});

module.exports = router;