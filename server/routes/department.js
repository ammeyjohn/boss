var express = require('express');
var utils = require('../utils.js');
var api = require('../api.js');
var router = express.Router();

router.get('/', function(req, res) {
    var departments = api.boss.user.getDepartments();
    res.json(departments);
});

module.exports = router;