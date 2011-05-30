/*
    Main application module.

    Ensure app is properly configured before it is accessed in other modules.
*/

var _ = require("./global")._;
var express = require("express");
var session = require("./session");
var path = require("path");
var mem = require("./memory");
var handler = require("./handler");
var msgHandler = require("./msghandler");
var socketio = require("socket.io");
var fs = require("fs");

var app = express.createServer();
exports.app = app;

app.run = function(){
    this.listen(this.port, this.host);
    console.log("%s is listening on port %d", this.name, this.port);
}

/*
    Configuration 
*/
app.configure(function(){
    app.name = "Tarkus"; 
   
    app.publicDir = __dirname + "/../public";
    app.viewsDir = __dirname + "/../views";
    app.httpHandler = handler.createHandler({ handlersDir : __dirname + "/http-handlers" });
    app.messageHandler = handler.createHandler({ handlersDir : __dirname + "/message-handlers" });
     
    app.use(express.methodOverride());    
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    
    app.sessionOptions = {
        secret: "42",
        key: "tarkus-session-id",
        store: new session.Store(),
        cookie: { httpOnly: false }
    };
 
    app.sessionMiddleware = express.session(app.sessionOptions);    
    app.use(app.sessionMiddleware);
    
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
    app.port = process.argv.length > 2 ? process.argv[2] : 8080;    
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

app.get("/ide", function(req, res){
    res.render("ide");
});

app.get("/", function(req, res){
    res.end();
});

app.get("/favicon.ico", function(req, res) {
    res.send(fs.readFileSync(app.publicDir + "/favicon.ico"));
});

app.run();

app.socket = socketio.listen(app);
app.socket.on("connection", function(client){
    console.log("socket connected");
    
    var msgHandlerObj = new msgHandler.MsgHandler(client);
    
    client.on("message", function(msg) {
    
        console.log("message received \"" + msg.name + "\"");        
        
        if (msg.name == "startSession") {
            // setup request members for the session middleware
            client.headers = {};
            client.cookies = {};
            client.url = "";
            client.cookies[app.sessionOptions.key] = msg.data.sessionId;
            client.headers["user-agent"] = msg.data.userAgent;
            msgHandlerObj.handler._respond(msg);
        } else {        
            
            // dummy response object for session middleware
            var res = {
                end: function() {
                    client.session = undefined;
                    client.sessionStore = undefined;
                },
                _header: "dummy"
            }
            
            app.sessionMiddleware(client, res, function() {                                       
                    msgHandlerObj.handle(msg);
                    res.end();
                });            
        }
    }); 
    
    client.on("disconnect", function(){});
});



