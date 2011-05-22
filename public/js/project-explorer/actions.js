var deps = [
    "jquery",
    "core/global",
    "core/io",
    "core/open-docs",
    "project-explorer/model",
];

define(deps, function($, global, socketIo, openDocs, model) {

return {
    init: function() {
        $(".tarkus-toolbutton").button();
        
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
/*
        mainMenu.addCallback("rename-node", function() {
            model.triggerRename();
        });

        mainMenu.addCallback("remove-node", function() {
            model.triggerRemove();
        });
*/
    }
};

});
