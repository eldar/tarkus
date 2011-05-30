var _ = require("./Global")._;
var unittest = require("./Unittest");

function _connect(sender, signal, receiver, slot) {

    var slots = signal.__slots;
    if (!slots) {
        var origSignal = signal;        
        signal = sender[origSignal.__name] = function() {
            var args = arguments;
            origSignal.apply(sender, args);
            _.each(slots, function(slot) {
                slot.apply(receiver, args);
            });         
        }
        _.extend(signal, origSignal);
        signal.__origSignal = origSignal;
        slots = signal.__slots = [];
    }
    slots.push(slot);
}

function connect(sender, signalName, receiver, slotOrName) {
    var slot;

    var signal = sender[signalName];
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
  
    _connect(sender, signal, receiver, slot);
}

exports.connect = connect;

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
    
    //var test1.foo.x = 43;

    connect(test1, "foo", test2, "bar");
    test1.foo(42);
    assert.ok(test1.fooCalls.length == 1);   
    assert.ok(test1.fooCalls[0] == 42);
    assert.ok(test2.barCalls.length == 1);
    assert.ok(test2.barCalls[0] == 42);
    //disconnect(test1, "foo", test2, "bar");    
});


