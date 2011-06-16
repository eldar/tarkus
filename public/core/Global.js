define([
    "dojo",
    "order!util/underscore",
    "order!util/backbone",
    "order!socket.io/socket.io.js"
], function(dojo) {
    dojo.setVisible = function(elem, visible) {
        dojo.style(elem, { display: (visible ? "block" : "none")});
    };
    
    return {
        makeUnique: function(obj, prefix) {
            obj.id = _.uniqueId(prefix);
        }
    };
});
