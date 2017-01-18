var path = require('path');
var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');

var user = require('./server/routes/user')
var project = require('./server/routes/project')
var log = require('./server/routes/log')

// 加载用户权限列表
global.users = null;
global.roles = null;

var filePath = path.join(__dirname, 'server/data/permission.json');
fs.readFile(filePath, function(err, data) {
    if (err) {
        return console.error(err);
    }

    var permission = JSON.parse(data.toString());
    global.users = permission.users;
    global.roles = permission.roles;
    // console.log(global.users);
    // console.log(global.roles);
});

var app = express();

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(err, req, res, next) {    
    res.status(500).send(err);
})

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api/user', user);
app.use('/api/project', project);
app.use('/api/log', log);

app.use(express.static(path.join(__dirname, 'web')));
app.get('*', function(req, res) {
    console.log(req.method + ' ' + req.url);
    res.sendFile(path.join(__dirname, './web/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

var server = app.listen(8055, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
});