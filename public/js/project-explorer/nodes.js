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
    
    var stripNodePath = function(fullPath) {
        // stripping of root node name
        var i = fullPath.indexOf("/");
        fullPath = fullPath.substr(i+1);
        // splitting path into project name and relative path
        i = fullPath.indexOf("/");
        return {
            project: fullPath.substr(0, i),
            path: fullPath.substr(i+1)
        };
    };
    
    var NodeImpl = _.inherits(Object, {
        constructor: function(name, type) {
            this.type = type;
            this.parent = null;
            this.children = [];
            this.id = _.uniqueId("project_node_");
            this.session = null;
            this.setName(name);
        },
        
        isFolder: function() {
            return (this.type == Type.Folder) || (this.type == Type.Project);
        },
        
        setName: function(nm) {
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
        },
       
        isDocument: function() {
            return this.type == Type.File;
        },
        
        setParent: function(parent) {
            if(this.parent) {
                if(parent == this.parent)
                    return;
                var siblings = this.parent.children;
                var idx = _.indexOf(siblings, this);
                if(idx != -1)
                    siblings.splice(idx, 1);
            };
            if(parent) {
                parent.children.push(this);
            };
            this.parent = parent;
        },
        
        find: function(pred) {
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
        },
        
        fullPath: function() {
            var node = this;
            var result = "";
            while(node) {
                result = node.name + "/" + result;
                node = node.parent;
            }
            return result;
        },
        
        getProject: function() {
            var node = this;
            while(node.parent.parent) {
                node = node.parent;
            }
            return node;
        },
        
        getDom: function() {
            return $("#" + this.id);
        },
        
        pathDefinition: function() {
            var stripped = stripNodePath(this.fullPath());
            return {
                projectName: stripped.project,
                path: stripped.path
            };
        },
    });
    
    return {
        Type : Type,
        Node : NodeImpl
    };
});
