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

router.get('/:id', function(req, res) {
    deptApi.getDepartmentById(parseInt(req.params.id))
        .then(function(department) {
            debug(department);
            res.json({
                code: 0,
                data: department
            });
        });
});

module.exports = router;