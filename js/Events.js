var _ = require("./Global")._;
var unittest = require("./Unittest");

function resolvePropertyReference(object, propNameOrValue, pred) {

    var result = {};
    var origObject = object;
    
    if (_.isString(propNameOrValue)) {
        result.name = propNameOrValue;

        do {
            var propDesc = Object.getOwnPropertyDescriptor(object, propNameOrValue);
            if (!_.isUndefined(propDesc)) {
                result.value = propDesc.value; // TODO: how standard is property descriptor layout?
                break;                
            }
            object = Object.getPrototypeOf(object);
        } while(object !== null);
        
        
        if (_.isUndefined(result.value))
            throw new Error(origObject + " has no property \"" + propValueOrName + "\"");
        
    } else { // propNameOrValue is not a property name, try to match it against a property value 
               
        if (_.isUndefined(pred)) {
            pred = function(value) {
                var propData = value.__data;                
                return  value === propNameOrValue || (!_.isUndefined(propData) && propData.originalValue === propNameOrValue);
            }
        }    
        
        var propName;
        do {
            var propNames = Object.getOwnPropertyNames(object);
            propName = _.detect(propNames, function(name) {
                // TODO: not so clean
                result.value = object[name];                
                return pred(result.value);              
            });
            if (!_.isUndefined(propName))
                break;
                
            object = Object.getPrototypeOf(object);
        } while(object !== null);
        
        if (_.isUndefined(propName))        
            throw new Error("Cannot resolve " + propNameOrValue + " to a property of " + origObject);
        result.name = propName;
    }
    
    result.isOwnProperty = object === origObject; 
    return result;
}

unittest(function(assert) {
    var Foo = function() { this.foo = 42 }
    Foo.prototype.bar = 43;
    var obj = new Foo();
    var prop = resolvePropertyReference(obj, "foo");
    assert.ok(prop.value == 42);
    assert.ok(prop.isOwnProperty);
    assert.ok(prop.name == "foo");
    
    prop = resolvePropertyReference(obj, 42);
    assert.ok(prop.value == 42);
    assert.ok(prop.isOwnProperty);
    assert.ok(prop.name == "foo");
    
    prop = resolvePropertyReference(obj, "bar");    
    assert.ok(prop.value == 43);
    assert.ok(!prop.isOwnProperty);
    assert.ok(prop.name == "bar");
    
    prop = resolvePropertyReference(obj, 43);    
    assert.ok(prop.value == 43);
    assert.ok(!prop.isOwnProperty);
    assert.ok(prop.name == "bar");
    
    assert.throws(function() {
        resolvePropertyReference(obj, "baz");
    });
    
    assert.throws(function() {
        resolvePropertyReference(obj, 44);
    });
});

function getPropertyData(object, propNameOrValue, create) {

    if (!_.isString(propNameOrValue)) {
        var propData = prop.__data;
        if (propData && propData.owner === object)
            return propData;
    }

    if (_.isUndefined(create))
        create = true;

    prop = resolvePropertyReference(object, propNameOrValue);
    
    if (prop.isOwnProperty) {
        var propData = prop.value.__data;
        if (!_.isUndefined(propData))
            return propData;
    }
    
    if (!create)
        return undefined;
    
    var origValue = prop.value;
    if (_.isFunction(origValue)) {
        var slots = [];        
        var newValue = object[prop.name] = function() {
            var args = arguments;
            origValue.apply(object, args);
            _.each(slots, function(slot) {
                slot.value.apply(slot.receiver, args);
            });                        
        }
        
        return newValue.__data = {
            slots: slots, // slots connected to this function
            signals: [], // signals connected to this function
            originalValue: origValue,
            owner: object
        };
    }
    
    // TODO: add implementations for other property types.
    return undefined;
}

unittest(function(assert) {
    var fooCalled = 0;
    var Foo = function() {
        this.foo = function() {
            ++fooCalled;
        }
    }
    Foo.prototype.bar = function() {
    }
    var foo = new Foo();
    var origFoo = foo.foo;
    var data = getPropertyData(foo, "foo");
    assert.ok(data.originalValue === origFoo);
    assert.ok(origFoo !== foo.foo);
    data.x = 42;
    data = getPropertyData(foo, foo.foo);
    assert.ok(data.x == 42);
    data = getPropertyData(foo, data.originalValue);
});

/*
function normalizeArgs(sender, signalName, receiver, slotOrSlotName, call) {
    var slot, signal = sender[signalName];

    if (!_.isFunction(signal))
        throw new Error(sender + " has no signal function \"" + signalName + "\""); 
    else if (!signal.__name)
        signal.__name = signalName;

    if (_.isString(slotOrSlotName)) {       
        slot = receiver[slotOrSlotName];
        if (!_.isFunction(slot))
            throw new Error(receiver + " has no slot function \"" + slotOrSlotName + "\"");
    } else if (_.isFunction(slotOrSlotName))
        slot = slotOrSlotName;        
    else if (_.isFunction(receiver) && slotOrSlotName === undefined) {
        slot = receiver;        
        receiver = undefined;
    } else
        throw new Error("Invalid slot specification");
        
    call(sender, signal, receiver, slot);
}

function connectImpl(sender, signal, receiver, slot) {
    var slots = signal.__slots;
    if (!slots) {
        var origSignal = signal;        
        signal = sender[origSignal.__name] = function() {
            var args = arguments;
            origSignal.apply(sender, args);
            _.each(slots, function(slotItem) {
                slotItem.slot.apply(slotItem.receiver, args);
            });         
        }
        _.extend(signal, origSignal);
        slots = signal.__slots = [];
    }
    slots.push([ receiver: receiver, slot: slot ]);
}

function disconnectImpl(sender, signal, receiver, slot) {
    var slots = signal.__slots;
    var idx = -1;
    if (slots) {
        idx = _.find(slots, function(slotItem) {            
            return receiver === slotItem.receiver && slot === slotItem.receiver;
        });           
    }
    if (idx === undefined)
        throw new Error("Slot not connected");
    else
        slots.splice(idx, 1);
}

function disconnectAll(object) {
    //disconnect signals
    _.each(object, function(prop)) {
        if (prop.__slots) {
            _.each()
        }

    });
    //disconnect slots
    var slots = [];
    _.each(object, function(slot)) {
        var signals = slot.__signals;
        
        if (senders) {
            _.each(senders, function(sender) {
                if (sender === this)
                    

            }, this);
        }
    }, this);

}

function connect(sender, signalName, receiver, slotOrSlotName) {
    normalizeArgs(sender, signalName, receiver, slotOrSlotName, connectImpl);
}

function disconnect(sender, signalName, receiver, slotOrSlotName) {
    if (arguments.length == 1)
        disconnectAll(sender);
    else        
        normalizeArgs(sender, signalName, receiver, slotOrSlotName, disconnectImpl);
}

exports.connect = connect;
exports.disconnect = disconnect;

unittest(function(assert) {
    var test1 = {
        fooCalls: [],
        foo: function(arg) {
            this.fooCalls.push(arg);        
        },
    }
   
    var test2 = {
        barCalls: [],
        bar: function(arg) {
            this.barCalls.push(arg);
        }
    }
    
    function reset() {
        test1.fooCalls = [];
        test2.barCalls = [];
    }
    
    //var test1.foo.x = 43;

    connect(test1, "foo", test2, "bar");
    test1.foo(42);
    assert.ok(test1.fooCalls.length == 1);   
    assert.ok(test1.fooCalls[0] == 42);
    assert.ok(test2.barCalls.length == 1);
    assert.ok(test2.barCalls[0] == 42);
    disconnect(test1, "foo", test2, "bar");
    reset();
    test1.foo(43);    
    assert.ok(test1.fooCalls.length == 1);   
    assert.ok(test1.fooCalls[0] == 43);
    assert.ok(test2.barCalls.length == 0);
});
*/


