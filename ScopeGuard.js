var unittest = require("./Unittest");
var _ = require("./Global")._;

var guard = function(scope) {
    var callbacks = [];
    
    var scopeThis = {    
        failure: function(callback) {
            callbacks.push([0, callback]);
        },
    
        exit: function(callback) {
            callbacks.push([1, callback]);
        },
    
        success: function(callback) {
            callbacks.push([2, callback]);
        }
    };
    
    try {
        scope.call(scopeThis);
    } catch (e) {
        for (var i = callbacks.length - 1; i >= 0; i--) {
            var callback = callbacks[i];
            var callbackType = callback[0];
            if (callbackType < 2)
                callback[1]();
        }
        throw e;        
    }
    
    for (var i = callbacks.length - 1; i >= 0; i--) {
        var callback = callbacks[i];
        var callbackType = callback[0];
        if (callbackType > 0)
            callback[1]();
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
    
    guard(function() {
        this.success(onSuccess);
        this.exit(onExit);
        this.failure(onFailure);
    });    
    assert.ok(_.isEqual(called, [1, 2]));
    
    reset();
    assert.throws(function() {    
        guard(function() {
            this.success(onSuccess);
            this.exit(onExit);
            this.failure(onFailure);
            throw new Error();            
        });
    });    
    assert.ok(_.isEqual(called, [0, 1]));
    
    reset();
    assert.throws(function() {    
        guard(function() {
            this.success(onSuccess);
            this.exit(onExit);
            this.failure(onFailure);
            
            guard(function() {
                this.failure(onFailure);
                this.success(onSuccess);
                this.exit(onExit);                
                throw new Error();            
            });         
        });
    });
    assert.ok(_.isEqual(called, [1, 0, 0, 1]));
    
        reset();
    assert.throws(function() {    
        guard(function() {
            this.success(onSuccess);
            this.exit(onExit);
            this.failure(onFailure);
            
            guard(function() {
                this.failure(onFailure);
                this.success(onSuccess);
                this.exit(onExit);
            });
            throw new Error();         
        });
    });
    assert.ok(_.isEqual(called, [1, 2, 0, 1]));
}); 
