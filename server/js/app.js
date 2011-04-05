/*
Main application module.
To access the application object from other modules, use:
var app = require('app');
*/

var express = require('express');
var app = express.createServer();
exports = app;

/*
Configuration
*/

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    
    app.port = 80;
    app.host = undefined;
});

app.configure('release', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('debug', function(){
    app.use(express.errorHandler());
});

/*
*/

app.start = function()
{
    this.listen(app.port, app.host);
}

app.get('/', function(req, res){
    res.send('hello world');
});

app.start();
