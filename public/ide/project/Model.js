var deps = [
    "dojo",
    "core/global",
//    "core/open-docs",
    "core/io",
    "ide/project/Nodes"
];

define(deps, function(dojo, global, /*openDocs, */socketIo, nodes) {

    var Node = nodes.Node;

    var ROOT_NAME = "root-node";
    
    var ProjectModel = dojo.declare(null, {
        currentNode: null,
        currentProject: null,
        
        constructor: function() {
            this.self = new Node(ROOT_NAME);
        },
        
        root: function() {
            return this.self;
        },

        _newProject: function(name) {
            var node = new Node(name, nodes.Type.Project);
            var root = this.self;
            node.setParent(root);
            this.notifyChildrenChanged(root);
            return node;
        },
        
        newProject: function(name) {
            var node = this._newProject(name);
            socketIo.send("projectCreate", { projectName: name});
            return node;
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
            if(this.projectByName(name))
                return;
            var self = this;
            socketIo.request("projectOpen", { projectName: name }, function(e) {
                var project = self._newProject(name);
                self._openDir(project, e.data);
                self.setCurrentNode(project.id);
            });
        },
        
        projectByName: function(name) {
            var list = _.filter(this.self.children, function(node) { return node.name == name; });
            return list.length > 0 ? list[0] : null;
        },
        
        checkExists: function(parent, name) {
            var exists = false;
            _.each(parent.children, function(node) {
                if(node.name === name)
                    exists = true;
            });
            return exists;
        },

        newNode: function(name, type, parent) {
            var node = new Node(name, type);
            node.setParent(parent);
            this.notifyChildrenChanged(parent);
            return node;
        },
        
        newFile: function(name, parent) {
            this._createFilePath(this.newNode(name, nodes.Type.File, parent), "fileCreate");
        },

        newFolder: function(name) {
            this._createFilePath(this.newNode(name, nodes.Type.Folder), "folderCreate");
        },
        
        _createFilePath: function(node, command) {
            if(!node)
                return;
            socketIo.send(command, node.pathDefinition());
//            this.trigger("trigger_openNode", node.parent);
//            this.setCurrentNode(node.id);
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
//                self.trigger("currentNodeChanged", node);
            }
            if(node.isDocument()) {
                if(!openDocs.entryByNode(node)) {
                    signalSent = true;
                    socketIo.request("requestFileContent", node.pathDefinition(), function(e) {
//                        openDocs.open(node, e.data);
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
//            this.trigger("trigger_rename", this.currentNode);
        },
        
        closeCurrentProject: function() {
            var project = this.currentProject;
            if(!project)
                return;
            project.iterate(function(node) {
//                openDocs.closeDocumentByNode(node);
            });
            this.removeNode(project);
            this.currentProject = null;
        },
        
        removeNode: function(node) {
            var siblings = node.parent.children;
//            this.trigger("trigger_remove", node);
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
//            this.trigger("nodeRenamed", node);
            return true;
        },
        
        // reimplementation of dijit.tree.model
        getRoot: function(onItem, onError) {
            onItem(this.self);
        },
        
        mayHaveChildren: function(item) {
            return item.children.length != 0;
        },
        
        getChildren: function(parentItem, callback, onError) {
            callback(parentItem.children);
        },
        
        getLabel: function(item) {
            return item.name;
        },
                
        isItem: function(something) {
            var elem = something.id;
            return elem != null;
        },
        
        getIdentity: function(item) {
            return item.id;
        },
        
		onChildrenChange: function(parent, newChildrenList) {
		},
		
		notifyChildrenChanged: function(parent) {
		    this.getChildren(parent, dojo.hitch(this, function(children){
			    this.onChildrenChange(parent, children);
			}));
		}
		
    });
    
    var model = new ProjectModel;
/*
    openDocs.bind("documentSelected", function(doc) {
        if(doc)
	        model.setCurrentNode(doc.node.id);
    });
    
    model.bind("currentNodeChanged", function(node) {
        // setting file in the open docs model
        if(node.isDocument())
            openDocs.setCurrentDocument(node);

        // update Close Project menu item
        global.mainMenu.setActionText("close-project", 'Close Project "' + node.getProject().name + '"');
    });

    model.bind("nodeRenamed", function(node) {
        if(node.isDocument())
            openDocs.handleNodeRenamed(node);
    });
*/    
    return model;
});
