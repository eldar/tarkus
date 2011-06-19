define([
    "ide/core/MainArea",
    "ide/core/MainMenu",
    "ide/core/Actions",
    "ide/core/Editor",
    "ide/core/OpenDocsWidget",
], function(mainArea, mainMenu, actions) {

    var ide = require("core/Ide");

    return {
        init: function() {
            var saveAct = actions.file.save;
            
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
        }
    };
});
