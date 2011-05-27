var deps = [
    "jquery",
    "core/global",
];

define(deps, function($, global) {
    var socket = new $.io.Socket();
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
            $.blockUI({ css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                'border-radius': '10px', 
                opacity: .5, 
                color: '#fff'
            },
            applyPlatformOpacityRules: false,
            // styles for the overlay 
            overlayCSS: { opacity: 0 }
            }); 
            setTimeout($.unblockUI, 10000); 
        }
    };
    
    socket.on("connect", function() {
        handler.request("startSession", {                
                sessionId: $.cookie("tarkus-session-id"),
                userAgent: navigator.userAgent
            });
    });

    socket.on("message", function(msg) {
        if(msg.type === "response") {
            var name = msg.name;
            if(map[name]) {
                $.unblockUI();
                map[name](msg);
                delete map[name];
            }
        }
    });
    
    socket.connect();    
    return handler;
});
