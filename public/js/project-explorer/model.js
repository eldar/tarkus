var deps = [
    "core/global",
    "core/open-docs",
    "core/io",
    "project-explorer/nodes"
];

define(deps, function(global, openDocs, socketIo, nodes) {

    var Node = nodes.Node;

    var ROOT_NAME = "root-node";
    
    var ProjectModel = Backbone.Model.extend({
        self: {},
        currentNode: null,
        currentProject: null,
        
        initialize: function() {
            this.self = new Node(ROOT_NAME);
        },

        addNodeNotify: function(node) {
            this.change({
                command : "add",
                node: node
            });
        },
        
        _newProject: function(name) {
            var node = new Node(name, nodes.Type.Project);
            node.setParent(this.self);
            this.addNodeNotify(node);
            return node;
        },
        
        newProject: function(name) {
            var node = this._newProject(name);
            socketIo.send("projectCreate", { projectName: name});
            this.setCurrentNode(node.id);
        },
        
        _openDir: function(parent, dataNode) {
            var self = this;
            _.each(dataNode.files, function(file) {
                self.newNode(file, nodes.Type.File, parent);
            });
            _.each(dataNode.dirs, function(content, name) {
                var dirNode = self.newNode(name, nodes.Type.Folder, parent);
                self._openDir(dirNode, content);
            });
        },
        
        openProject: function(name) {
            var self = this;
            socketIo.request("projectOpen", { projectName: name }, function(e) {
                var project = self._newProject(name);
                self._openDir(project, e.data);
                self.setCurrentNode(project.id);
            });
        },

        newNode: function(name, type, parentNode) {
            var current = this.currentNode;
            var parent = parentNode || (current.isFolder() ? current : current.parent);
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
            this.addNodeNotify(node);
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
            this.setCurrentNode(node.id);
        },
        
        getNodeById: function(id) {
            return this.self.find(function(node) {
                return node.id == id;
            });
        },
        
        setCurrentNode: function(id) {
            this.currentNode = this.getNodeById(id);
            var node = this.currentNode;
            this.currentProject = node.getProject();

            var signalSent = false;
            var self = this;
            var sendSignal = function() {
                self.trigger("currentNodeChanged", node);
            }
            if(node.isDocument()) {
                if(!openDocs.entryByNode(node)) {
                    signalSent = true;
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
        
        closeCurrentProject: function() {
            var project = this.currentProject;
            if(!project)
                return;
            project.iterate(function(node) {
                openDocs.closeDocumentByNode(node);
            });
            this.removeNode(project);
            this.currentProject = null;
        },
        
        removeNode: function(node) {
            var siblings = node.parent.children;
            this.trigger("trigger_remove", node);
            node.setParent(null);
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
        // setting file in the open docs model
        if(node.isDocument())
            openDocs.setCurrentDocument(node);

        // update Close Project menu item
        global.mainMenu.setActionName("close-project", 'Close Project "' + node.getProject().name + '"');
    });

    model.bind("nodeRenamed", function(node) {
        if(node.isDocument())
            openDocs.handleNodeRenamed(node);
    });
    
    return model;
});