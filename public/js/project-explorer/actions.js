var deps = [
    "jquery",
    "jquery-ui/jquery-ui"
];

define(deps, function($) {
    var global = require("core/global");

    $(".tarkus-toolbutton").button();
    
    $("#new-project").click(function() {
        var projName = prompt("Please, select project name");
        global.projectManager.newProject(projName);
    });
});
