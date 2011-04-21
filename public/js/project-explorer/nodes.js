define(function() {
    var Type = {
        Folder : 1,
        Project : 2,
        File : 3
    };
    
    var getFileExt = function(name) {
        var parts = name.split(".");
        if(parts.length == 1)
            return "";
        else
            return parts[parts.length - 1];
    };
    
    var NodeImpl = function(name, type) {
        this.type = type;
        this.parent = null;
        this.children = [];
        this.id = _.uniqueId("project_node_");
        this.session = null;

        this.isFolder = function() {
            return (this.type == Type.Folder) || (this.type == Type.Project);
        };
        
        this.setName = function(nm) {
            this.name = nm;
            if(this.isFolder()) {
                this.docType = "folder";
                return;
            }
            var ext = getFileExt(nm);
            var dType;
            switch(ext) {
                case "js":
                case "css":
                    dType = ext;
                    break;
                default:
                    dType = "unknown";
            }
            this.docType = dType;
        };

        this.setName(name);
        
        this.isDocument = function() {
            return this.type == Type.File;
        };
        
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
        
        this.getDom = function() {
            return $("#" + this.id);
        };
    };
    
    return {
        Type : Type,
        Node : NodeImpl
    };
});