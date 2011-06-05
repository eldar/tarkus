define([
    "dojo",
    "ide/core/OpenDocs",
    "dijit/Tree",
    "ide/core/MainArea",
], function(dojo, openDocs, Tree, mainArea) {
    var OpenWidget = dojo.declare(Tree, {
        autoExpand: false,
        showRoot: false,
        persist: false,
        
        constructor: function(params) {
            dojo.connect(params.model, "currentDocChanged", dojo.hitch(this, function(doc) {
                if(doc)
                    this.set("path", [this.model.root(), doc]);
            }));
        },
        
        getIconClass: function(node, opened) {
            return "";
        },
      
        onClick: function(doc) {
            openDocs.setCurrentDocument(doc);
        }
        
    });
    var tree = new OpenWidget({ model: openDocs });
    tree.placeAt(mainArea.left.bottom.domNode);
    return tree;
});
