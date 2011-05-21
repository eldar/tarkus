var deps = [
    "jquery",
    "core/global",
];

define(deps, function($, global) {
    var socket = new $.io.Socket();
    socket.connect();
    
    socket.on("connect", function() {
        
    });
    
    var map = {};
    
    socket.on("message", function(e) {
        if(e.type === "responce") {
            var msg = e.message;
            if(map[msg]) {
                $.unblockUI();
                map[msg](e);
                map[msg] = null;
            }
        }
    });
    
    var handler = {
        _socket: socket,
        
        send: function(message, data) {
            this._socket.send({
                message: message,
                data: data
            });
        },
        
        request: function(message, data, callback) {
            map[message] = callback;
            this.send(message, data);
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
    
    return handler;
});