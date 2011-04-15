var deps = [
    "jquery",
    "jquery-ui/jquery-ui"
];

define(deps, function($) {
    var global = require("core/global");
    var manager = global.projectManager;

    $(".tarkus-toolbutton").button();
    
    $("#new-project").click(function() {
        var projName = prompt("Please, select project name");
        manager.newProject(projName);
    });
    
    $("#new-file").click(function() {
        if(!manager.currentNode)
            return;
        var fileName = prompt("Please, select file name");
        if(!fileName)
            return;
        manager.newFile(fileName);
    });
});
