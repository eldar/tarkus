var deps = [
    "dojo",
    "core/global",
    "core/io",
    "ide/core/Actions",
    "ui/TemplatedWidget",
    "dijit/Dialog",
    "dijit/form/Button",
    "text!ide/project/OpenProjectDialog.html",
//    "core/open-docs",
    "ide/project/Model",
    "ide/project/Tree"
];

define(deps, function(dojo, global, socketIo, actions, TemplatedWidget, Dialog, Button, OpenProjectTemplate, /*openDocs,*/ model, tree) {

//dijit.getEnclosingWidget(this.domNode.parentNode)
    var openDialog = new dijit.Dialog({
        content: new TemplatedWidget({
            templateString: OpenProjectTemplate
        }),
        
        title: "Open Project",
        
        style: "width: 200px"
    });

    openDialog.startup();

    dojo.connect(actions.file.openProject, "triggered", function() {
        openDialog.show();
    });
    
    dojo.connect(actions.file.newProject, "triggered", function() {
        var projName = prompt("Please, select project name");
        if(!projName)
            return;
        var node = model.newProject(projName);
        tree.set("path", [model.root(), node]);
        
    });
    
    dojo.connect(actions.file.newFile, "triggered", function() {
        var path = tree.get("path");
        if(path.length === 0)
            return;
        var selected = _.last(path);
        var parent = selected.isFolder() ? selected : selected.parent;
        var fileName = prompt("Please, select file name");
        if(!fileName)
            return;
            
        if(model.checkExists(parent, fileName)) {
            alert("File with name " + name + " already exists");
            return;
        }
        var node = model.newFile(fileName, parent);
        tree.set("path", node.fullObjectPath());
    });
/*        
        var OpenProjectDialog = _.inherits(Object, {
            constructor: function() {
                this.self = $("#open-project-dialog");
                var self = this;
                this.self.dialog({
                    height: 300,
                    modal: true,
                    autoOpen: false,
                    buttons: {
                        "Ok": function() { self._onOk() },
                        "Cancel": function() { self._onCancel(); }
                    }
                });
                this.projectList = this.self.find("#project-list");
                this.projectList.listWidget();
            },
            
            run: function(callback) {
                this._onFinish = callback;
                this.projectList.listWidget("clear");
                this.self.dialog("open");
                var self = this;
                socketIo.request("getProjectList", {}, function(e) {
                    _.each(e.data.list, function(elem) {
                        self.projectList.listWidget("createNode", "last", { "data" : { "title" : elem } });
                    });
                });
            },
            
            _close: function(value) {
                this.self.dialog("close");
                this._onFinish(value);
            },
            
            _onOk: function() {
                var list = this.projectList;
                this._close(list.listWidget("getTitle", list.listWidget("selectedNode")));
            },
            
            _onCancel: function() {
                this._close("");
            }
        });
        
        var openProjectDialog = new OpenProjectDialog();
        
        var mainMenu = global.mainMenu;
        
        mainMenu.addCallback("new-project", function() {
            var projName = prompt("Please, select project name");
            if(!projName)
                return;
            model.newProject(projName);
        });

        mainMenu.addCallback("new-file", function() {
            if(!model.currentNode)
                return;
            var fileName = prompt("Please, select file name");
            if(!fileName)
                return;
            model.newFile(fileName);
        });

        mainMenu.addCallback("new-folder", function() {
            if(!model.currentNode)
                return;
            var folderName = prompt("Please, select folder name");
            if(!folderName)
                return;
            model.newFolder(folderName);
        });

        mainMenu.addCallback("open-project", function() {
            openProjectDialog.run(function(project) {
                if(project)
                    model.openProject(project);
            });
        });

        mainMenu.addCallback("save-node", function() {
            openDocs.saveNode();
        });

        mainMenu.addCallback("close-project", function() {
            model.closeCurrentProject();
        });
        
        openDocs
            .bind("entryChanged", function(doc) {
                mainMenu.setActionEnabled("save-node", doc.isModified);
            })
            .bind("documentSelected", function(doc) {
                var text = "Save";
                if(doc)
                    text += " \"" + doc.name + "\"";
                mainMenu.setActionText("save-node", text);
            });
            */
/*
        mainMenu.addCallback("rename-node", function() {
            model.triggerRename();
        });

        mainMenu.addCallback("remove-node", function() {
            model.triggerRemove();
        });
*/

});
