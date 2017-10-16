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

router.post('/', function(req, res) {
    var dept = req.body.dept;
    debug(dept);
    deptApi.adddept(dept)
        .then(function(ret) {
            debug(ret);
            res.json({
                code: 0,
                data: ret
            });
        });
});

router.put('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    debug('params:id=%s', id);

    var dept = req.body.dept;
    debug(dept);

    deptApi.modifydept(id, dept)
        .then(function(ret) {
            res.json({
                code: 0,
                data: ret
            });
        });
});

router.delete('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    debug('params:id=%s', id);
    deptApi.removedept(id)
        .then(function(ret) {
            res.json({
                code: 0,
                data: ret
            });
        });
});

module.exports = router;