define(function() {
    var NodeImpl = function(name, parentNode) {
        this.parent = parentNode;
        this.name = name;
        this.children = [];
        
        this.addChild = function(node) {
            children.push(node);
        }
    };
    
    return {
        Node : NodeImpl
    };
});
