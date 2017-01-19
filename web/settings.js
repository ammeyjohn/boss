define([
], function() {
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


        // 用户列表
        users: [{
            account: 'hujianing',
            name: '胡嘉宁',
            department: 25
        }, {
            account: 'shijianping',
            name: '施剑平',
            department: -1
        }, {
            account: 'yuanjie',
            name: '袁杰',
            department: -2
        }, {
            account: 'qiweiwei',
            name: '齐巍巍',
            department: -3
        }],
        
        // 部门列表
        departments: [{
            id: 25,
            code: 'RD',
            name: '软件研发部'
        }, {
            id: -1,
            parent: 25,
            code: 'UAP',
            name: '软件研发平台组'
        }, {
            id: -2,
            parent: 25,
            code: 'PD',
            name: '软件研发生产组'
        }, {
            id: -3,
            parent: 25,
            code: 'CM',
            name: '软件研发客服组'
        }]
    }

    return settings;
});