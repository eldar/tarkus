var unittest = require("./Unittest");
var _ = require("./Global")._;

var guard = function(context, scope) {
    if (!scope) {
        scope = context; 
        context = this;
    }

    var callbacks = [];
    
    var scopeOps = {    
        failure: function(callback) {
            callbacks.push({ type: 0, fn: callback });
        },
    
        exit: function(callback) {
            callbacks.push({ type: 1, fn: callback });
        },
    
        success: function(callback) {
            callbacks.push({ type: 2, fn: callback });
        }
    };
    
    try {
        scope.call(context, scopeOps);
    } catch (e) {
        for (var i = callbacks.length - 1; i >= 0; i--) {
            var callback = callbacks[i];
            if (callback.type < 2)
                callback.fn.call(context, e);
        }
        throw e;        
    }
    
    for (var i = callbacks.length - 1; i >= 0; i--) {
        var callback = callbacks[i];
        if (callback.type > 0)
            callback.fn.call(context);
    }
}

exports = module.exports = guard;

unittest(function(assert) {
    var called = [];
    function createCallback(type) {
        return function() {
            called.push(type);
        }        
    }   
    
    function reset() {
        called.length = 0;
    }
    
    var onFailure = createCallback(0);
    var onExit = createCallback(1);
    var onSuccess = createCallback(2);
    
    guard(function(scope) {
        scope.success(onSuccess);
        scope.exit(onExit);
        scope.failure(onFailure);
    });    
    assert.ok(_.isEqual(called, [1, 2]));
    
    reset();
    assert.throws(function() {    
        guard(function(scope) {
            scope.success(onSuccess);
            scope.exit(onExit);
            scope.failure(onFailure);
            throw new Error();            
        });
    });    
    assert.ok(_.isEqual(called, [0, 1]));
    
    reset();
    assert.throws(function() {    
        guard(function(scope) {
            scope.success(onSuccess);
            scope.exit(onExit);
            scope.failure(onFailure);
            
            guard(function(scope) {
                scope.failure(onFailure);
                scope.success(onSuccess);
                scope.exit(onExit);                
                throw new Error();            
            });         
        });
    });
    assert.ok(_.isEqual(called, [1, 0, 0, 1]));
    
    reset();
    assert.throws(function() {    
        guard(function(scope) {
            scope.success(onSuccess);
            scope.exit(onExit);
            scope.failure(onFailure);
            
            guard(function(scope) {
                scope.failure(onFailure);
                scope.success(onSuccess);
                scope.exit(onExit);
            });
            throw new Error();         
        });
    });
    assert.ok(_.isEqual(called, [1, 2, 0, 1]));
    
    reset();
    var object = {
        bar: function() {
            this.x = 42;
        },
        
        foo: function() {
            guard(this, function(scope) {
                scope.exit(this.bar);
            });
        }
    }
    object.foo();
    assert.ok(object.x == 42);
}); 
