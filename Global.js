var _ = require("underscore");

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
    },
    
    isUndefinedOrNull: function(value) {
        return _.isUndefined(value) || value === null;
    },
    
    /*
        Inserts elements of the source array at the specified index
        into the target array. If the position is not specified, the elements of the source array
        will be appended to the end of the target array.
    */
    insert: function(target, source, index) {        
        var len = source.length;                
        if (len > 0) {
            if (_.isUndefined(index))
                index = target.length;            
            target.length += len;
            
            console.log("index: ", index, ", len: ", len);            
            _.move(target, index + len, index, target.len - index);     
            for (var i = 0; i < len; ++i, ++index)
                target[index] = source[i];
        }
    },
    
    /*
        Copies count elements of the supplied array from sourceIndex to
        targetIndex. Target and source aray segments are allowed to overlap.
    */
    move: function(array, targetIndex, sourceIndex, count) {
        if (_.isUndefined(count))
            count = array.length - sourceIndex;
        else if (targetIndex == sourceIndex || count == 0)
            return;
            
        if (targetIndex < sourceIndex) {
            for (; count > 0; --count)
                array[targetIndex++] = array[sourceIndex++];
        } else {
            targetIndex += count;
            sourceIndex += count;
            for (; count > 0; --count)
                array[targetIndex--] = array[sourceIndex--];
        }
    }
});

exports._ = _;
