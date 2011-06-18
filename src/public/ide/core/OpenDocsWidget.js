define([
    "dojo",
    "sumo",
    "ui/List",
    "ui/FixedTreeNode",
    "ide/core/OpenDocs",
    "ide/core/MainArea",
    "ide/core/ConfirmDialog"
], function(dojo, sumo, List, FixedTreeNode, openDocs, mainArea, confirmDialog) {
    
    var ClosableNode = dojo.declare(FixedTreeNode, {
        postCreate: function() {
            var button = dojo.create("div", {
                style: {
                    float: "right",
                    display: "none",
                    marginRight: "5px"
                }
            });
            dojo.addClass(button, "close-button");
            dojo.place(button, this.rowNode, "first");

            dojo.connect(this.domNode, "onmouseenter", function() {
                sumo.setVisible(button, true);
            });
            dojo.connect(this.domNode, "onmouseleave", function() {
                sumo.setVisible(button, false);
            });
            
            dojo.connect(button, "onclick", dojo.hitch(this, function(event) {
                openDocs.closeDocumentPrompt(this.item, dojo.hitch(confirmDialog.single, "promptClose"));
                dojo.stopEvent(event);
            }));
        }
    });

    var OpenWidget = dojo.declare(List, {
        constructor: function(params) {
            dojo.connect(params.model, "currentDocChangedForView", dojo.hitch(this, function(doc) {
                if(doc)
                    this.set("path", [this.model.root(), doc]);
            }));
        },
        
        onClick: function(doc) {
            openDocs.setCurrentDocument(doc);
        },
        
        _createTreeNode: function(args) {
            return new ClosableNode(args);
        }
        
    });
    var tree = new OpenWidget({ model: openDocs });
    tree.placeAt(mainArea.left.bottom.domNode);
    return tree;
});
