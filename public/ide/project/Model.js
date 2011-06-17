define([
    "dojo",
    "core/Global",
    "core/Io",
    "core/ModelBase",
    "ide/core/OpenDocs",
    "ide/project/Nodes"
], function(dojo, global, socketIo, Model, openDocs, nodes) {

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
            dataNode.dirs.sort(function(a, b) { return (a.name > b.name) ? 1 : -1});
            _.each(dataNode.dirs, function(dir) {
                var dirNode = new Node(dir.name, nodes.Type.Folder, parent);
                self._openDir(dirNode, dir.content);
            });
            dataNode.files.sort();
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
        
        updateCurrentProject: function(node) {
            this.currentProject = node.getProject();
        },
        
        closeCurrentProject: function(prompt) {
            var project = this.currentProject;
            if(!project)
                return;
            var allDocs = [];
            project.iterate(function(node) {
                var doc = openDocs.docByNode(node);
                if(doc)
                    allDocs.push(doc);
            });
            
            var self = this;
            var doClose = function() {
                _.each(allDocs, function(doc, i) {
                    openDocs.closeDocument(doc);
                });
                project.setParent(null);
                self.currentProject = null;
                self.notifyChildrenChanged(self.root());
            };
            
            var unsavedDocs = _.filter(allDocs, function(doc) { return doc.isModified(); });
            if(unsavedDocs.length > 0) {
                prompt(_.map(unsavedDocs, function(doc) { return doc.name(); }), function(save, forSave) {
                    if(save) {
                        _.each(unsavedDocs, function(doc, i) {
                            if(forSave[i])
                                openDocs.saveDocument(doc);
                        });
                    }
                    doClose();
                });
            } else {
                doClose();
            }
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
            return true;
        },
        
        setLabel: function(node, label) {
            var msg = _.extend(node.pathDefinition(), {
                newPath: node.parent.pathDefinition().path + "/" + label
            });
            var self = this;
            socketIo.request("renamePath", msg, function(e) {
                // TODO check for any errors
            });
            node.setName(label);
            self.onChange(node);
        },
        
        deleteNode: function(node) {
            openDocs.closeDocument(openDocs.docByNode(node));
            socketIo.request("deletePath", node.pathDefinition(), function(e) {
                // TODO check for any errors
            });
            var parent = node.parent;
            node.setParent(null);
            this.notifyChildrenChanged(parent);
        }
    });
    var model = new ProjectModel;
    
    dojo.connect(model, "onChange", openDocs, "handleNodeChange");
    return model;
});
