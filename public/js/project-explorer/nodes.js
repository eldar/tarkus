define(function() {
    var NodeImpl = function(name, parentNode) {
        this.parent = parentNode;
        this.name = name;
    };
    
    return {
        Node : NodeImpl
    };
});
