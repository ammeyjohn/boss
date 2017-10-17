var assert = require('chai').assert;
var _ = require('lodash');
var deptApi = require('../api/department');

describe('API', () => {
    describe('Department', () => {

        var DEPT = {
            "id": 9999,
            "parent": 9998,
            "code": "TEST",
            "name": "测试"
        };

        describe('addDeparment', () => {
            it('Should return the new department object with integer id.', (done) => {
                // 测试新建部门
                var dept = _.cloneDeep(DEPT);
                deptApi.addDeparment(dept)
                    .then(function(ret) {
                        assert.isNotNull(ret, 'addDeparment should not return null.');
                        assert.notEqual(ret.id, 0, 'property "id" should has integer value.')
                        done();
                    })
                    .catch(err => done(err));
            });
        });

        describe('getDepartmentById', () => {
            it('Should return the department which added previously.', (done) => {
                // 测试部门查询
                deptApi.getDepartmentById(DEPT.id)
                    .then(function(ret) {
                        delete ret._id;
                        assert.isNotNull(ret, 'getDepartmentById should not return null.');
                        assert.deepEqual(ret, DEPT, 'find result should equals input.');
                        done();
                    })
                    .catch(err => done(err));
            });
        });

        describe('modifyDepartment', () => {
            it('Should modify the specified department record.', (done) => {
                // 测试部门修改
                var dept = _.cloneDeep(DEPT);
                dept.parent = 1234;

                deptApi.modifyDepartment(DEPT.id, dept)
                    .then(function(ret) {
                        assert.isTrue(ret, 'modifyDepartment should return true.');

                        // 测试部门查询
                        deptApi.getDepartmentById(DEPT.id)
                            .then(function(ret) {
                                delete ret._id;
                                assert.isNotNull(ret, 'getDepartmentById should not return null.');
                                assert.deepEqual(ret, dept, 'find result should equals input.');
                                done();
                            })
                            .catch(err => done(err));
                    })
                    .catch(err => done(err));
            });
        });

        describe('removeDepartment', () => {
            it('Should remove the specified department record.', (done) => {
                // 测试部门删除
                deptApi.removeDepartment(DEPT.id)
                    .then(function(ret) {
                        console.log(ret);
                        assert.isTrue(ret, 'removeDepartment should return true.');

                        // 测试部门查询
                        deptApi.getDepartmentById(DEPT.id)
                            .then(function(ret) {
                                assert.notExists(ret, 'getDepartmentById should return null.');
                                done();
                            })
                            .catch(err => done(err));
                    })
                    .catch(err => done(err));
            });
        });

        after(() => {
            deptApi.removeDepartment(DEPT.id);
            console.log(DEPT.id + ' has been removed.');
        });

    });
});