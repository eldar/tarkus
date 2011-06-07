var deps = [
    "dojo",
    "core/Global",
    "core/Io",
    "core/ModelBase",
    "ide/core/OpenDocs",
    "ide/project/Nodes"
];

define(deps, function(dojo, global, socketIo, Model, openDocs, nodes) {

    var Node = nodes.Node;

    var ROOT_NAME = "root-node";
    
    var ProjectModel = dojo.declare(Model.ModelBase, {
        currentNode: null,
        currentProject: null,
        
        constructor: function() {
            this._root = new Node(ROOT_NAME);
        },
        
        root: function() {
            return this._root;
        },

        _newProject: function(name) {
            return new Node(name, nodes.Type.Project, this.root());
        },
        
        creteNewProject: function(name) {
            var node = this._newProject(name);
            this.notifyChildrenChanged(this.root());
            socketIo.send("projectCreate", { projectName: name});
            return node;
        },
        
        _openDir: function(parent, dataNode) {
            var self = this;
            _.each(dataNode.dirs, function(content, name) {
                var dirNode = new Node(name, nodes.Type.Folder, parent);
                self._openDir(dirNode, content);
            });
            _.each(dataNode.files, function(file) {
                new Node(file, nodes.Type.File, parent);
            });
        },
        
        openProject: function(name, onOpen) {
            if(this.projectByName(name))
                return;
            socketIo.request("projectOpen", { projectName: name }, dojo.hitch(this, function(e) {
                var project = this._newProject(name);
                this._openDir(project, e.data);
                this.notifyChildrenChanged(this.root());
                if(onOpen)
                   onOpen(project);
            }));
        },
        
        projectByName: function(name) {
            var list = _.filter(this.root().children, function(node) { return node.name == name; });
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

        createNewNode: function(name, parent, isFile) {
            var type = isFile ? nodes.Type.File : nodes.Type.Folder;
            var action = isFile ? "fileCreate" : "folderCreate";
            return this._createFilePath(new Node(name, type, parent), action);
        },
        
        _createFilePath: function(node, command) {
            if(!node)
                return;
            this.notifyChildrenChanged(node.parent);
            socketIo.send(command, node.pathDefinition());
            return node;
        },
        
        getNodeById: function(id) {
            return this.root().find(function(node) {
                return node.id == id;
            });
        },
        
        openAndSelectDocument: function(node) {
            if(!node.isDocument())
                return;
            var select = function() { openDocs.setCurrentDocumentByNode(node) };
            if(!openDocs.docByNode(node)) {
                this.openDocument(node, function() {
                    select();
                });
            } else {
                select();
            }
        },
        
        openDocument: function(node, onOpen) {
            if(node.isDocument() && !openDocs.docByNode(node)) {
                socketIo.request("requestFileContent", node.pathDefinition(), function(e) {
                    openDocs.open(node, e.data);
                    onOpen();
                });
            }
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
        }
    });
    
    var model = new ProjectModel;
/*
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
