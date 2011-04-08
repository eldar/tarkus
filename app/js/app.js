/*
    Main application module.

    The application object is avalable to any
    module via the global namespace. The object is also available as export from this module
    (require(path/to/this/module).app)

    Ensure app is properly configured before accessed in other modules.
*/

var express = require("express");
var path = require("path");

var app = global.app = exports.app = express.createServer();

/*
*/
app.require = function(module, ignoreExt)
{
    var ext;    
    if (this.modulePrefix) {
        if (!ignoreExt && (ext = path.extname(module))) {
            module = module.slice(0, -ext.length) + this.modulePrefix + ext;  
        } else
            module = module + this.modulePrefix;
    }
    
    return require(module);
}

/*
    Configuration 
*/

app.configure(function(){
    app.name = "Tarkus";
    app.publicDir = __dirname + "/../../public";
    app.viewsDir = __dirname + "/../views";    
       
    app.use(express.methodOverride());
    app.use(express.bodyParser());    
    app.use(app.router);
    app.use(express.static(app.publicDir));    
    
    // common view and tmplate settings
    app.set("views", app.viewsDir);
    app.set("view engine", "view");
    app.set('view options', {
            layout: false
        });
    app.register(".view", require(__dirname + "/jqtpl/jqtpl"));
    
    // network settings    
    app.port = 8080;
    app.host = undefined;
});

/*
    Configuration code run after
    environment specific callbacks.
*/
app.postConfigure = function()
{    
}

app.configure("development", function(){
    app.modulePostfix = "_debug";

    app.use(express.errorHandler({
            dumpExceptions: true,
            showStack:      true
        }));
        
    app.postConfigure();
});

app.configure("production", function(){
    app.use(express.errorHandler());
    
    app.postConfigure();
});

app.get("/", function(req, res){
    res.render("index.view");
});

// At thise point, modules depending on the application object
// can be imported.

app.run = function(){
    this.listen(this.port, this.host);
    console.log("%s is listening on port %d", this.name, this.port);
}

app.run();

