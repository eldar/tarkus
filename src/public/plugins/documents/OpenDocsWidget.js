define([
    "dojo",
    "sumo",
    "ui/List",
    "ui/FixedTreeNode",
    "ui/ConfirmDialog"
], function(dojo, sumo, List, FixedTreeNode, ConfirmDialog) {
    
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
            
            var confirmDialog = new ConfirmDialog.Single();
            confirmDialog.startup();
            
            dojo.connect(button, "onclick", dojo.hitch(this, function(event) {
                this.tree.model.closeDocumentPrompt(this.item, dojo.hitch(confirmDialog, "promptClose"));
                dojo.stopEvent(event);
            }));
        }
    });

    var OpenDocsWidget = dojo.declare(List, {
        constructor: function(params) {
            dojo.connect(params.model, "currentDocChangedForView", dojo.hitch(this, function(doc) {
                if(doc)
                    this.set("path", [this.model.root(), doc]);
            }));
        },
        
        onClick: function(doc) {
            this.model.setCurrentDocument(doc);
        },
        
        _createTreeNode: function(args) {
            return new ClosableNode(args);
        }
        
    });
    return OpenDocsWidget;
});
