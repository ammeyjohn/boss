define([], function() {
    'use strict';

    var settings = {

        // 日志类型
        logTypes: [{
            id: 0,
            code: 'KFSC',
            name: '开发和生产'
        }, {
            id: 1,
            code: 'WH',
            name: '维护'
        }, {
            id: 2,
            code: 'YF',
            name: '研发'
        }, {
            id: 3,
            code: 'XS',
            name: '销售'
        }, {
            id: 4,
            code: 'CS',
            name: '测试'
        }, {
            id: 5,
            code: 'XCSS',
            name: '现场实施'
        }, {
            id: 6,
            code: 'SC',
            name: '市场'
        }, {
            id: 7,
            code: 'ZBQ',
            name: '质保期'
        }, {
            id: 8,
            code: 'XT',
            name: '协调'
        }],

        roles: {
            root: {
                name: "超级管理员"
            },
            admin: {
                name: "管理员"
            },
            director: {
                name: "总监"
            },
            manager: {
                name: "部门经理"
            },
            staff: {
                name: "员工"
            }
        }
    }



    return settings;
});