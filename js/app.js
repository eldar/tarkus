/*
    Main application module.

    The application object is available to any
    module via the global namespace. The object is also available as an export from this module
    (require(path/to/this/module).app)

    Ensure app is properly configured before accessed in other modules.
*/

var _ = require("underscore");
var express = require("express");
var path = require("path");
var mem = require("./memory");
var handler = require("./handler");
var socketio = require("socket.io");

var app = express.createServer();
global.app = exports.app = app;

app.run = function(){
	this.listen(this.port, this.host);
	console.log("%s is listening on port %d", this.name, this.port);
}

/*
	Configuration 
*/
app.configure(function(){
	app.name = "Tarkus"; 
   
	app.publicDir = __dirname + "/../../public";
	app.viewsDir = __dirname + "/../views";
    app.httpHandler = handler.createHandler({ handlersDir : __dirname + "/http-handlers" });
    app.messageHandler = handler.createHandler({ handlersDir : __dirname + "/message-handlers" });
	   
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	//app.use(_.bind(app.httpHandler.handle, app.httpHandler));
	app.use(app.router);
	app.use(express.static(app.publicDir));
	
	// common view and tmplate settings
	app.set("views", app.viewsDir);
	app.set("view engine", "html");
	app.set('view options', {
			layout: false
		});
        
    console.log();
	app.register(".html", require(__dirname + "/jqtpl/jqtpl"));
	
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

app.get("/:view", function(req, res){
	res.render(req.params.view);
});

app.run();

app.socket = socketio.listen(app);
app.socket.on('connection', function(client){

    client.on('message', function(data) {
        /*
        var req = {
                method: "MESSAGE",
                url: data.url,
                data: data,
            };
            
        req = _.extend(req, client);
        var res = {};
        function next() {
        }
        
        app.messageHandler.handle(req, res, next);
        return res;
        */        
    }); 
    client.on('disconnect', function(){}); 
});



