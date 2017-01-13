var express = require('express');
var api = require('../api.js');
var router = express.Router();

router.get('/:user', function(req, res) {
    var user = req.params.user;
    api.boss.project.getByUser(user, function(result) {
        res.json(result);
    });
});

module.exports = router;