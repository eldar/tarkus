/*
Main application module.
To access the application object in other modules, use:
var app = require("<app-dir>/app").app;
*/

var express = require("express");
var templ = require("jqtpl");

var app = express.createServer();
exports.app = app;

/*
Configuration
*/
app.configure(function(){
    app.name = "Tarkus";

    app.publicDir = __dirname + "/../../public";
    app.viewsDir = __dirname + "/../views";
    
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(app.publicDir));
    app.use(app.router);
    
    
    // view and template settings
    app.set("views", app.viewsDir);
    app.set("view engine", "html");
    app.set('view options', {
            layout: false
        });
    app.register(".html", templ);
    
    // network settings    
    app.port = 8080;
    app.host = undefined;
});

app.configure("development", function(){
    app.use(express.errorHandler({
            dumpExceptions: true,
            showStack:      true
        }));
});

app.configure("production", function(){
    app.use(express.errorHandler());
});

app.get("/", function(req, res){
    res.render("test/index.html");
});

app.run = function(){
    this.listen(this.port, this.host);
    console.log("%s is listening on port %d", this.name, this.port);
}

app.run();

