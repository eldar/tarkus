/*
Main application module.
To access the application object in other modules, use:
var app = require('app');
*/

var express = require('express');
var templ = require('jqtpl');

var app = express.createServer();
exports = app;

/*
Configuration
*/
app.configure(function(){
    this.name = "Tarkus";
    
    this.use(express.methodOverride());
    this.use(express.bodyParser());
    this.use(this.router);
    
    // view and template settings
    this.set("views", __dirname + "/../views");
    this.set("view engine", "html" );
    this.set('view options', {
            layout: false
        });
    this.register(".html", templ);
    
    // network settings    
    this.set("port", 80);
    this.set("host", undefined);
});

app.configure("development", function(){
    this.use(express.errorHandler({
            dumpExceptions: true,
            showStack:      true
        }));
});

app.configure("production", function(){
    app.use(express.errorHandler());
});

/*
*/
app.start = function(){
    this.listen(this.set("port"), this.set("host"));
    console.log("%s is listening on port %d", this.name, this.set("port"));
}

app.get("/", function(req, res){
    res.render("index.html");
});

app.start();
