define([
    "plugins/editors/Editors",
    "plugins/editors/EditorComponent"
], function(Editors, EditorComponent) {

    var ide = require("core/Ide");

    return {
        init: function() {
            var editors = new Editors();
            ide.register("editors", editors);
            
            var mainArea = ide.query("mainArea");
            var ideComponent = new EditorComponent().placeAt(mainArea.editorPane.domNode);
            ideComponent.startup();
            ideComponent.setVisible(false);
            
            editors.setCurrent(ideComponent);
        }
    };
});
