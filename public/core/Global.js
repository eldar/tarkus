var deps = [  
    "order!util/underscore",
    "order!util/backbone",
    "order!socket.io/socket.io.js"
];

define(deps, function() {
    return {
        makeUnique: function(obj, prefix) {
            obj.id = _.uniqueId(prefix);
        }
    };
});
