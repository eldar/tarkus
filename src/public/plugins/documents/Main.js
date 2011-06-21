define([
    "plugins/documents/OpenDocs",
    "plugins/documents/OpenDocsWidget"
], function(OpenDocuments, OpenDocsWidget) {

    var ide = require("core/Ide");
    var openDocs = ide.query("openDocs");

    return {
        init: function() {
            var openDocs = new OpenDocuments;
            ide.register("openDocs", openDocs);

            var saveAct = ide.query("actions").file.save;
            
            var openDocs = ide.query("openDocs");
            
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

            var mainArea = ide.query("mainArea");
            var widget = new OpenDocsWidget({ model: openDocs });
            widget.placeAt(mainArea.left.bottom.domNode);
        }
    };
});
