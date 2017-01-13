var debug = require('debug')('boss:server');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var user = require('./server/routes/user')
var project = require('./server/routes/project')
var log = require('./server/routes/log')

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

app.use(express.static('web'));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './web/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
});

server.on('listening', function() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
});