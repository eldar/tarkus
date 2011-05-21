var deps = [
    "jquery",
    "core/io",
    "project-explorer/model",
];

define(deps, function($, socketIo, manager) {

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
        
        $("#new-project").click(function() {
            var projName = prompt("Please, select project name");
            if(!projName)
                return;
            manager.newProject(projName);
        });

        $("#open-project").click(function() {
            openProjectDialog.run(function(project) {
                if(project)
                    manager.openProject(project);
            });
        });

        $("#new-file").click(function() {
            if(!manager.currentNode)
                return;
            var fileName = prompt("Please, select file name");
            if(!fileName)
                return;
            manager.newFile(fileName);
        });
        
        $("#new-folder").click(function() {
            if(!manager.currentNode)
                return;
            var folderName = prompt("Please, select folder name");
            if(!folderName)
                return;
            manager.newFolder(folderName);
        });

        $("#rename-node").click(function() {
            manager.triggerRename();
        });

        $("#remove-node").click(function() {
            manager.triggerRemove();
        });
    }
};

});
