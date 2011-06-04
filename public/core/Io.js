var deps = [
    "dojo",
    "core/Global",
];

define(deps, function(dojo, global) {
    var socket = new io.Socket();
    var map = {};

    var handler = {
        
        send: function(name, data) {
            socket.send({
                name: name,
                data: data
            });
        },
        
        request: function(name, data, callback) {
            map[name] = callback;
            this.send(name, data);
//            $.blockUI();
//            setTimeout($.unblockUI, 10000);
        }
    };
    
    socket.on("connect", function() {
        handler.request("startSession", {                
                sessionId: dojo.cookie("tarkus-session-id"),
                userAgent: navigator.userAgent
            });
    });

    socket.on("message", function(msg) {
        if(msg.type === "response") {
            var name = msg.name;
            if(map[name]) {
//                $.unblockUI();
                map[name](msg);
                delete map[name];
            }
        }
    });
    
    socket.connect();    
    return handler;
});
