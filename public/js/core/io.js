var deps = [
    "jquery",
    "core/global",
];

define(deps, function($, global) {
    var socket = new $.io.Socket();
    socket.connect();
    
    socket.on("connect", function() {
        
    });
    
    socket.on("message", function(data) {
        
    });
    
    var handler = {
        _socket: socket,
        
        send: function(message, data) {
            this._socket.send({
                message: message,
                data: data
            });
        }
    };
    
    return handler;
});