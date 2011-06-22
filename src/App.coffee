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

app.run = ->
    @listen(@port, @host)
    console.log("%s is listening on port %d", config.appName, @port)

# Application configuration
app.configure(->    
    app.httpHandler = handler.createHandler(handlersDir : config.dirs.httpHandlers)
    app.messageHandler = handler.createHandler(handlersDir : config.dirs.messageHandlers)
     
    app.use(express.methodOverride())    
    app.use(express.bodyParser())
    app.use(express.cookieParser())
    
    app.sessionOptions =
        secret: "42"
        key: "tarkus-session-id"
        store: new session.Store()
        cookie: { httpOnly: false }
 
    app.sessionMiddleware = express.session(app.sessionOptions)    
    app.use(app.sessionMiddleware)
    
    #app.use(_.bind(app.httpHandler.handle, app.httpHandler))
    app.use(app.router)
    app.use(express.static(config.dirs.public))
    
    # common view and tmplate settings
    app.set("views", config.dirs.views)
    app.set("view engine", "html")
    app.set('view options',
            layout: false
        )
        
    console.log()
    app.register(".html", require(__dirname + "/jqtpl/jqtpl"))
    
    # network settings
    app.port = if process.argv.length > 2 then process.argv[2] else 8080    
    app.host = undefined    
)

# Configuration code run after
# environment specific callbacks.
app.postConfigure = ->

app.configure("development", ->
    app.use(express.errorHandler(
            dumpExceptions: true,
            showStack:      true
        ))
        
    app.postConfigure()
)

app.configure("production", ->
    app.use(express.errorHandler())
   
    app.postConfigure()
)

app.get("/ide", (req, res) ->
    res.render("ide")
)

app.get("/", (req, res) ->
    res.end()
)

app.get("/favicon.ico", (req, res) ->
    res.send(fs.readFileSync(config.dirs.public + "/favicon.ico"))
)

app.run()

app.socket = socketio.listen(app)
app.socket.on("connection", (client) ->
    console.log("socket connected")
    
    msgHandlerObj = new msgHandler.MsgHandler(client)
    
    client.on("message", (msg) ->    
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

