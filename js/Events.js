var _ = require("./Global")._;
var unittest = require("./Unittest");

function callNormalized(sender, signalName, receiver, slotOrName, call) {
    var slot, signal = sender[signalName];

    if (!_.isFunction(signal))
        throw new Error(sender + " has no signal function \"" + signalName + "\""); 
    else if (!signal.__name)
        signal.__name = signalName;

    if (_.isString(slotOrName)) {       
        slot = receiver[slotOrName];
        if (!_.isFunction(slot))
            throw new Error(receiver + " has no slot function \"" + slotOrName + "\"");
    } else if (_.isFunction(slotOrName))
        slot = slotOrName;        
    else if (_.isFunction(receiver) && slotOrName === undefined) {
        slot = receiver;        
        receiver = undefined;
    } else
        throw new Error("Invalid slot specification");
        
    call(sender, signal, receiver, slot);
}

function _connect(sender, signal, receiver, slot) {
    var slots = signal.__slots;
    if (!slots) {
        var origSignal = signal;        
        signal = sender[origSignal.__name] = function() {
            var args = arguments;
            origSignal.apply(sender, args);
            _.each(slots, function(slotItem) {
                slotItem[1].apply(slotItem[0], args);
            });         
        }
        _.extend(signal, origSignal);
        signal.__origSignal = origSignal;
        slots = signal.__slots = [];
    }
    slots.push([ receiver, slot ]);
}

function _disconnect(sender, signal, receiver, slot) {
    var slots = signal.__slots;
    var idx = -1;
    if (slots) {
        idx = _.find(slots, function(slotItem) {            
            return receiver === slotItem[0] && slot === slotItem[1];
        });           
    }
    if (idx === undefined)
        throw new Error("Slot not connected");
    else
        slots.splice(idx, 1);
    //TODO: restore origSignal when slot count drops to zero.
}

function connect(sender, signalName, receiver, slotOrName) {
    callNormalized(sender, signalName, receiver, slotOrName, _connect);
}

function disconnect(sender, signalName, receiver, slotOrName) {
    callNormalized(sender, signalName, receiver, slotOrName, _disconnect);
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


