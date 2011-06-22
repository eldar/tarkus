define([
    "plugins/documents/OpenDocs",
    "plugins/documents/OpenDocsWidget",
    "plugins/documents/TabView"
], function(OpenDocuments, OpenDocsWidget, TabView) {

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

            var tabs = new TabView({
                model: openDocs,
                tabPosition: "top",
                useMenu: true,
                dir: "ltr",
                tabPosition: false,
                nested:false
            });
            tabs.placeAt(mainArea.tabPane.domNode);
            tabs.addButton(0);
            tabs.addButton(1);
/*            var footer = dojo.create("div", {
                style: "border-bottom-width: 1px solid; height: 5px; display: block"
            });
            dojo.place(footer, mainArea.tabPane.domNode);
*/
            mainArea.centerContainer.resize();
        }
    };
});
