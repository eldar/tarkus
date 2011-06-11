define([
    "dojo",
    "dijit/Tree",
    "ide/core/OpenDocs",
    "ide/core/MainArea",
    "ide/core/ConfirmDialog"
], function(dojo, Tree, openDocs, mainArea, confirmDialog) {
    
    var ClosableNode = dojo.declare(dijit._TreeNode, {
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
                dojo.style(button, { display: "block"});
            });
            dojo.connect(this.domNode, "onmouseleave", function() {
                dojo.style(button, { display: "none"});
            });
            
            dojo.connect(button, "onclick", dojo.hitch(this, function(event) {
                openDocs.closeDocumentPrompt(this.item, dojo.hitch(confirmDialog.single, "promptClose"));
                dojo.stopEvent(event);
            }));
        }
    });

    var OpenWidget = dojo.declare(Tree, {
        autoExpand: false,
        showRoot: false,
        persist: false,
        
        constructor: function(params) {
            dojo.connect(params.model, "currentDocChangedForView", dojo.hitch(this, function(doc) {
                if(doc)
                    this.set("path", [this.model.root(), doc]);
            }));
        },
        
        getIconClass: function(node, opened) {
            return "";
        },
      
        onClick: function(doc) {
            openDocs.setCurrentDocument(doc);
        },
        
	    _createTreeNode: function(args){
		    return new ClosableNode(args);
	    }
        
    });
    var tree = new OpenWidget({ model: openDocs });
    tree.placeAt(mainArea.left.bottom.domNode);
    return tree;
});
