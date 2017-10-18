var debug = require('debug')('boss:router:department');
var express = require('express');
var deptApi = require('../api/department');
var router = express.Router();

// 获取全部部门列表
router.get('/', function(req, res) {
    deptApi.getDepartments().then(function(departments) {
        debug(departments);
        res.json({
            code: 0,
            data: departments
        });
    });
});

// 根据部门编号查询
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

// 添加或者更新部门信息
router.post('/', function(req, res) {
    var dept = req.body.dept;
    debug(dept);
    deptApi.saveDepartment(dept)
        .then(function(ret) {
            debug(ret);
            res.json({
                code: 0,
                data: ret
            });
        });
});

// 根据_id删除部门信息
router.delete('/:key', function(req, res) {
    var key = req.params.key;
    debug('params:key=%s', key);
    deptApi.removeDepartment(key)
        .then(function(ret) {
            res.json({
                code: 0,
                data: ret
            });
        });
});

module.exports = router;