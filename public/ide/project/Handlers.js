var deps = [
    "dojo",
    "core/Global",
    "core/Io",
    "util/sprintf",
    "ui/TemplatedWidget",
    "dijit/Dialog",
    "dijit/form/Button",
    "ide/core/Actions",
    "ide/core/OpenDocs",
    "ide/project/Model",
    "ide/project/Tree",
    "text!ide/project/OpenProjectDialog.html"
];

define(deps, function(dojo, global, socketIo, str, TemplatedWidget, Dialog, Button, actions, openDocs, model, tree, OpenProjectTemplate) {

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
        //openDialog.show();
        model.openProject("haha", function(node) {
            var treeNodes = tree.getNodesByItem(node);
            tree._expandNode(_.first(treeNodes), false);
        });
    });
    
    dojo.connect(actions.file.newProject, "triggered", function() {
        var name = prompt("Please, select project name");
        if(!name)
            return;
        var node = model.creteNewProject(name);
        tree.set("path", [model.root(), node]);
    });
    
    var newSomething = function(isFile) {
        var path = tree.get("path");
        if(path.length === 0)
            return;
        var selected = _.last(path);
        var parent = selected.isFolder() ? selected : selected.parent;
        var fileName = prompt(str.sprintf("Please, select %s name", isFile ? "file" : "folder"));
        if(!fileName)
            return;
            
        if(model.checkExists(parent, fileName)) {
            alert("File with name " + name + " already exists");
            return;
        }
        var node = model.createNewNode(fileName, parent, isFile);
        tree.set("path", node.fullObjectPath());
        return node;
    };
    
    dojo.connect(actions.file.newFile, "triggered", function() {
        var node = newSomething(true);
        model.openAndSelectDocument(node);
    });
    
    dojo.connect(actions.file.newFolder, "triggered", function() {
        newSomething(false);
    });

    var saveAct = actions.file.save;
    var updateSaveSensitivity = function(doc) {
        saveAct.set("disabled", doc ? !doc.isModified() : true);
    };
    dojo.connect(saveAct, "triggered", function() {
        openDocs.saveNode();
    });
    dojo.connect(openDocs, "onChange", function(doc) {
        updateSaveSensitivity(doc);
    });
    dojo.connect(openDocs, "currentDocChanged", function(doc) {
        var text = "Save";
        if(doc)
            text += " \"" + openDocs.getLabel(doc) + "\"";
        saveAct.set("label", text);
        updateSaveSensitivity(doc);
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
        
        mainMenu.addCallback("open-project", function() {
            openProjectDialog.run(function(project) {
                if(project)
                    model.openProject(project);
            });
        });

        mainMenu.addCallback("close-project", function() {
            model.closeCurrentProject();
        });
        
        mainMenu.addCallback("rename-node", function() {
            model.triggerRename();
        });

        mainMenu.addCallback("remove-node", function() {
            model.triggerRemove();
        });
*/

});
