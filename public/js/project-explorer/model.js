var deps = [
    "jquery"
];

define(deps, function($) {
    var global = require("core/global");
    var nodes = require("project-explorer/nodes");
    var Node = nodes.Node;

    var ProjectModel = Backbone.Model.extend({
        self : {},
        currentNode : null,
        
        initialize : function() {
            this.self = new Node("root-node");
        },

        newProject : function(name) {
            var node = new Node(name, nodes.Type.Project);
            this.self.addChild(node);
            this.change({
                command : "add",
                node: node
            });
        },

        newNode : function(name, type) {
            var node = new Node(name, type);
            var current = this.currentNode;
            var isFolder = current.isFolder();
            var parent = current.isFolder() ? current : current.parent;
            parent.addChild(node);
            this.change({
                command : "add",
                node: node
            });
        },
        
        newFile : function(name) {
            this.newNode(name, nodes.Type.File);
        },

        newFolder : function(name) {
            this.newNode(name, nodes.Type.Folder);
        },
        
        getNodeById : function(id) {
            return this.self.find(function(node) {
                return node.id == id;
            });
        },
        
        setCurrentNode : function(id) {
            this.currentNode = this.getNodeById(id);
            var node = this.currentNode;
            if(node.isDocument()) {
                if(!node.session)
                    node.session = global.env.getSession(node.docType);
                global.env.editor.setSession(node.session);
            }
        },
        
        triggerRename : function() {
            if(!this.currentNode)
                return;
            this.trigger("trigger_rename", this.currentNode);
        },
        
        renameNode : function(id, newName) {
            var node = this.getNodeById(id);
            var foundSame = false;
            _.each(node.parent.children, function(child) {
                if(child.name == newName && child != node)
                    foundSame = true;
            });
            if(foundSame)
                return false;
            node.name = newName;
            return true;
        }
    });

    global.projectManager = new ProjectModel;
});
