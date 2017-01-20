var debug = require('debug')('boss:router:department');
var express = require('express');
var deptApi = require('../api/department');
var router = express.Router();

router.get('/', function(req, res) {
    deptApi.getDepartments().then(function(departments) {
    	debug(departments);
        res.json({
            code: 0,
            data: departments
        });
    });
});

module.exports = router;