define ["dojo", "socket.io/socket.io.js"], (dojo) ->
  socket = io.connect()
  map = {}
  
  handler =
    send: (name, data) ->
      socket.emit "ideMessage",
        name: name
        data: data

    request: (name, data, callback) ->
      map[name] = callback
      @send name, data
      # $.blockUI();
      # setTimeout($.unblockUI, 10000);

  socket.on "connect", ->
    handler.request "startSession",
      sessionId: dojo.cookie "tarkus-session-id"
      userAgent: navigator.userAgent

    console.log "connected"

  socket.on "ideMessage", (msg) ->
    if msg.type is "response"
      name = msg.name
      if map[name]
        # $.unblockUI();
        map[name] msg
        delete map[name]

  socket.on "disconnect", ->
    console.log "we are disconnected!"

  handler
