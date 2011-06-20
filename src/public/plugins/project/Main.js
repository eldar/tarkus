define([
    "plugins/project/Model",
    "plugins/project/Tree",
    "plugins/project/Handlers"
], function(ProjectModel, ProjectTree, Handlers) {

    var ide = require("core/Ide");
    var openDocs = ide.query("openDocs");

    return {
        init: function() {
            var model = new ProjectModel(openDocs);
            ide.register("project.model", model);
            
            var tree = new ProjectTree({ model: model });
            var mainArea = ide.query("mainArea");
            tree.placeAt(mainArea.left.top.domNode);
            mainArea.left.top.resize(); // otherwise the tree scrollbars doesn't appear until next resize
            ide.register("project.tree", tree);
            
            Handlers.init();
        }
    };
});
