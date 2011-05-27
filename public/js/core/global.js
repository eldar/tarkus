var deps = [  
    "order!util/underscore",
    "order!util/backbone",
    "order!jquery",
    "order!jquery-plugins/jquery.cookie",
    "order!jquery-ui/jquery-ui.min",
    "order!ui-misc/jquery-ui-layout",
    "order!ui-misc/jquery-blockui",
    "order!ui-misc/jstree",
    "order!socket.io/socket.io.js"
];

define(deps, function() {

    // Prototypal inheritance
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    
    // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function(){};

    _.mixin({
    
        // Classic inheritance (adapted from backbone)
        inherits: function(superClass, protoProps, staticProps) {
            var subClass;

            // The constructor function for the new class is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call `super()`.
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                subClass = protoProps.constructor;
            } else {
                subClass = function(){ return superClass.apply(this, arguments); };
            }

            // Set the prototype chain to inherit from `superClass`, without calling
            // `superClass`'s constructor function.
            ctor.prototype = superClass.prototype;
            subClass.prototype = new ctor();

            // Add prototype properties (instance properties) to the subClass,
            // if supplied.
            if (protoProps) _.extend(subClass.prototype, protoProps);

            // Add static properties to the constructor function, if supplied.
            if (staticProps) _.extend(subClass, staticProps);

            // Correctly set subClass's `prototype.constructor`, for `instanceof`.
            subClass.prototype.constructor = subClass;
            
            // Convenience reference to super constructor
            subClass.prototype.super = superClass;
            
            // Set a convenience property in case the superClass's prototype is needed later.
            subClass.superProto = superClass.prototype;            
             
            return subClass;
        }                
    });
   
    return {};
});
