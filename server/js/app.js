/*
Main application module.
To access the application object in other modules, use:
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
    
    app.set('views', __dirname + '/views');
    
    app.set('port', 80);
    app.set('host', undefined);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

/*
*/

app.start = function()
{
    this.listen(this.set('port'), this.set('host'));
}

app.get('/', function(req, res){
    res.send('hello world');
});

app.start();
