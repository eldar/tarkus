define(function() {
    
    var Controller = function() {
        this.foo = 42;            
    }
        
    Controller.prototype = {
        bar : function {
            console.log("bar!");
        }
    }
    
    return {
        Controller : Controller
    }

});
