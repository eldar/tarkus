define([
    "ide/project/Model",
    "ide/project/Tree",
    "ide/project/Handlers"
], function(ProjectModel, Tree, Handlers) {

    var ide = require("core/Ide");
    var openDocs = ide.query("openDocs");

    return {
        init: function() {
            var model = new ProjectModel(openDocs);
            ide.register("project.model", model);
            Tree.init();
            Handlers.init();
        }
    };
});
