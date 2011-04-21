var deps = [  
    "order!util/underscore",
    "order!util/backbone",
    "order!jquery",
    "order!jquery-ui/jquery-ui",
    "order!ui-misc/splitter",
    "order!ui-misc/jstree"
];

define(deps, function() {

    // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function(){};

    _.mixin({
        inherits: function(superCtor, protoProps, staticProps) {
            var subCtor;

            // The constructor function for the new class is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call `super()`.
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                subCtor = protoProps.constructor;
            } else {
                subCtor = function(){ return superCtor.apply(this, arguments); };
            }

            // Set the prototype chain to inherit from `superCtor`, without calling
            // `superCtor`'s constructor function.
            ctor.prototype = superCtor.prototype;
            subCtor.prototype = new ctor();

            // Add prototype properties (instance properties) to the subCtor,
            // if supplied.
            if (protoProps) _.extend(subCtor.prototype, protoProps);

            // Add static properties to the constructor function, if supplied.
            if (staticProps) _.extend(subCtor, staticProps);

            // Correctly set subCtor's `prototype.constructor`, for `instanceof`.
            subCtor.prototype.constructor = subCtor;
            
            // Convenience reference to super constructor
            subCtor.prototype.super = superCtor;
            
            // Set a convenience property in case the superCtor's prototype is needed later.
            subCtor.superProto = superCtor.prototype;            
             
            return subCtor;
        }                
    });
   
    return {};
});
