# Main application module.
#
# Ensure app is properly configured before it is accessed in other modules.

express = require("express")
socketio = require("socket.io")
fs = require("fs")
path = require("path")

_ = require("Global")._
config = require("./Config")
session = require("./Session")
mem = require("./Memory")
handler = require("./Handler")
msgHandler = require("./MsgHandler")
events = require("./Events")

app = express.createServer()
exports.app = app

# Application configuration
app.configure(->    
    @httpHandler = handler.createHandler(handlersDir : config.dirs.httpHandlers)
    @messageHandler = handler.createHandler(handlersDir : config.dirs.messageHandlers)
     
    @use express.methodOverride()    
    @use express.bodyParser()
    @use express.cookieParser()
    
    @sessionOptions =
        secret: "42"
        key: "tarkus-session-id"
        store: new session.Store
        cookie: { httpOnly: false }
 
    @sessionMiddleware = express.session @sessionOptions    
    @use @sessionMiddleware
    
    #@use _.bind(@httpHandler.handle, @httpHandler)
    
    if @settings.env == "development"    
        @use express.compiler
            src: config.dirs.public            
            enable: ["coffeescript"]        
    
    @use @router
    @use express.static(config.dirs.public)
    
    # common view and template settings
    # @set("views", config.dirs.views)
    # @set("view engine", "html")
    # @set('view options',
    #        layout: false
    #    )
        
    # @register(".html", require(__dirname + "/jqtpl/jqtpl"))    
    
    if @settings.env == "development"
        @use express.errorHandler
            dumpExceptions: true
            showStack: true
    else
        @use express.errorHandler()
    
    # network settings
    @port = if process.argv.length > 2 then process.argv[2] else 8080
    @host = undefined    
)

app.configure("development", ->        
)

app.configure("production", ->
)

app.get("/", (req, res) ->
    res.end()
)

app.get("/favicon.ico", (req, res) ->
    res.send(fs.readFileSync(config.dirs.public + "/icons/favicon.ico"))
)

app.listen(app.port, app.host)
console.log("%s is listening on port %d", config.appName, app.port)

app.io = socketio.listen(app)
app.io.sockets.on("connection", (client) ->
    console.log("socket connected")
    
    msgHandlerObj = new msgHandler.MsgHandler(client)
    
    client.on("ideMessage", (msg) ->    
        console.log("message received \"" + msg.name + "\"")        
        
        if msg.name == "startSession"
            # setup request members for the session middleware
            client.headers = {}
            client.cookies = {}
            client.url = ""
            client.cookies[app.sessionOptions.key] = msg.data.sessionId
            client.headers["user-agent"] = msg.data.userAgent
            msgHandlerObj.handler._respond(msg)
        else       
            
            # dummy response object for session middleware
            res =
                end: ->
                    client.session = undefined
                    client.sessionStore = undefined                
                _header: "dummy"
            
            
            app.sessionMiddleware(client, res, ->                                       
                msgHandlerObj.handle(msg)
                res.end()
            )
    ) 
    
    client.on("disconnect", ->)
)

