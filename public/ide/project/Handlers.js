define([
    "dojo",
    "core/Global",
    "core/Io",
    "core/ModelBase",
    "util/sprintf",
    "ui/TemplatedWidget",
    "dijit/Dialog",
    "ide/core/Actions",
    "ide/core/OpenDocs",
    "ide/core/ConfirmDialog",
    "ide/project/Model",
    "ide/project/Tree",
    "text!ide/project/OpenProjectDialog.html",
    "dijit/Tree",
    "dijit/layout/ContentPane"
], function(dojo, global, socketIo, Model, str, TemplatedWidget, Dialog,
            actions, openDocs, confirmDialog, model, tree, OpenProjectTemplate, Tree) {

    var OpenDialog = dojo.declare(Dialog, {
        content: new TemplatedWidget({
            templateString: OpenProjectTemplate,
            
            postCreate: function() {
               var self = this;
               this.listData = new Model.ListModel();
               this.list = new Tree({
                   model: this.listData,
                   autoExpand: false,
                   showRoot: false,
                   persist: false,
                   getIconClass: function() { return ""; },
                   onDblClick: function() {
                       self.getParent().hide();
                       self.onOk();
                   }
               }, this.listWidgetNode);
            },
            
            getParent: function() {
                return dijit.getEnclosingWidget(this.domNode.parentNode);
            },
            
            onOk: function() {
                var name = _.last(this.list.get("path")).name;
                this.getParent().itemSelected(name);
            }
        }),

        title: "Open Project",
        
        style: "width: 200px;"
    });
    
    var openDialog = new OpenDialog();
    openDialog.startup();

    dojo.connect(openDialog, "itemSelected", function(name) {
        if(!name)
            return;
        model.openProject(name, function(node) {
            var treeNodes = tree.getNodesByItem(node);
            tree._expandNode(_.first(treeNodes), false);
        });
    });

    dojo.connect(actions.file.openProject, "triggered", function() {
        socketIo.request("getProjectList", {}, function(e) {
            openDialog.content.listData.setData(e.data.list);
            openDialog.show();
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
        openDocs.saveCurrentDocument();
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
    
    dojo.connect(actions.file.closeProject, "triggered", function() {
        model.closeCurrentProject(dojo.hitch(confirmDialog.multi, "promptClose"));
    });
});
