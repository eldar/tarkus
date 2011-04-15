define(function() {
    var NodeImpl = function(name) {
        this.parent = null;
        this.name = name;
        this.children = [];
        this.id = _.uniqueId("project_node_");
        
        this.addChild = function(node) {
            this.children.push(node);
            node.parent = this;
        };
        
        this.find = function(pred) {
            var findImpl = function(node, pred) {
                if(pred(node))
                    return node;
                var children = node.children;
                var len = children.length;
                for(var i = 0; i < len; i++) {
                    var res = findImpl(children[i], pred);
                    if(res != null)
                        return res;
                }
                return null;
            };
            return findImpl(this, pred);
        };
    };
    
    return {
        Node : NodeImpl
    };
});
