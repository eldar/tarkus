var deps = [
    "jquery",
    "project-explorer/model"
];

define(deps, function($, manager) {

return {
    init: function() {
        $(".tarkus-toolbutton").button();
        $(".tarkus-dialog").dialog({
            height: 200,
            modal: true,
            autoOpen: false
        });
        
        // initialize open project dialog here
        $("#open-project-dialog #project-list").listWidget()
        
        $("#new-project").click(function() {
            var projName = prompt("Please, select project name");
            if(!projName)
                return;
            manager.newProject(projName);
        });

        $("#open-project").click(function() {
            $("#open-project-dialog").dialog("open");
/*            var projName = prompt("Please, select project name");
            if(!projName)
                return;
            manager.openProject(projName);*/
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
