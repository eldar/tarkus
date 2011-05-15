var deps = [
    "core/global",
    "core/opened-docs",
    "core/io",
    "project-explorer/nodes"
];

define(deps, function(global, openDocs, socketIo, nodes) {

    var Node = nodes.Node;

    var ROOT_NAME = "root-node";
    
    var ProjectModel = Backbone.Model.extend({
        self: {},
        currentNode: null,
        
        initialize: function() {
            this.self = new Node(ROOT_NAME);
        },

        newProject: function(name) {
            var node = new Node(name, nodes.Type.Project);
            node.setParent(this.self);
            this.change({
                command : "add",
                node: node
            });
            socketIo.send("projectCreate", { projectName: name});
        },

        newNode: function(name, type) {
            var current = this.currentNode;
            var parent = current.isFolder() ? current : current.parent;
            var sameName = false;
            _.each(parent.children, function(node) {
                if(node.name === name)
                    sameName = true;
            });
            if(sameName) {
                alert("File with name " + name + " already exists");
                return null;
            }
            var node = new Node(name, type);
            node.setParent(parent);
            return node;
        },
        
        newFile: function(name) {
            this._createFilePath(this.newNode(name, nodes.Type.File), "fileCreate");
        },

        newFolder: function(name) {
            this._createFilePath(this.newNode(name, nodes.Type.Folder), "folderCreate");
        },
        
        _createFilePath: function(node, command) {
            if(!node)
                return;
            socketIo.send(command, node.pathDefinition());
            this.change({
                command : "add",
                node: node
            });
        },
        
        getNodeById: function(id) {
            return this.self.find(function(node) {
                return node.id == id;
            });
        },
        
        setCurrentNode: function(id) {
            this.currentNode = this.getNodeById(id);
            var node = this.currentNode;
            var signalSent = false;
            var self = this;
            var sendSignal = function() {
                self.trigger("currentNodeChanged", node);
                signalSent = true;
            }
            if(node.isDocument()) {
                if(!openDocs.entryByNode(node)) {
                    socketIo.request("requestFileContent", node.pathDefinition(), function(e) {
                        openDocs.open(node, e.data);
                        sendSignal();
                    });
                }
            }
            if(!signalSent)
                sendSignal();
        },
        
        triggerRename: function() {
            if(!this.currentNode)
                return;
            this.trigger("trigger_rename", this.currentNode);
        },
        
        triggerRemove: function() {
            var node = this.currentNode;
            if(!node)
                return;
            var siblings = node.parent.children;
            this.trigger("trigger_remove", node);
            node.setParent(null);
            var idx = 5;
        },
        
        renameNode: function(id, newName) {
            var node = this.getNodeById(id);
            var foundSame = false;
            _.each(node.parent.children, function(child) {
                if(child.name == newName && child != node)
                    foundSame = true;
            });
            if(foundSame)
                return false;
            node.setName(newName);
            // change syntax highlighting
            this.trigger("nodeRenamed", node);
            return true;
        }
    });
    
    var model = new ProjectModel;

    openDocs.bind("documentSelected", function(id) {
        model.setCurrentNode(id);
    });
    
    model.bind("currentNodeChanged", function(node) {
        if(node.isDocument())
            openDocs.setCurrentDocument(node);
    });

    model.bind("nodeRenamed", function(node) {
        if(node.isDocument())
            openDocs.handleNodeRenamed(node);
    });
    
    return model;
});
