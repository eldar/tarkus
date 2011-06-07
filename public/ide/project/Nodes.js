define([
    "dojo",
    "core/Global"
], function(dojo, global) {
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
    
    var NodeImpl = dojo.declare(null, {
        constructor: function(name, type, parent) {
            this.type = type;
            this.setParent(parent);
            this.children = [];
            global.makeUnique(this, "pn_");
            this.id = _.uniqueId("project_node_");
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
                case "html":
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
            this.parent = parent || null;
        },

        iterate: function(callback) {
            var iterImpl = function(node, pred) {
                callback(node);

                var children = node.children;
                for(var i = 0; i < children.length; i++) {
                    iterImpl(children[i], pred);
                }
            };
            return iterImpl(this, callback);
        },
        
        find: function(pred) {
            var findImpl = function(node, pred) {
                if(pred(node))
                    return node;
                var children = node.children;
                for(var i = 0; i < children.length; i++) {
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
        
        fullObjectPath: function() {
            var result = [];
            var node = this;
            while(node) {
                result.unshift(node);
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