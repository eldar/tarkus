define([
    "dojo",
    "dijit/Tree",
    "ui/FixedTreeNode"
], function(dojo, Tree, FixedTreeNode) {
    return dojo.declare(Tree, {
        autoExpand: false,
        showRoot: false,
        persist: false,
        getIconClass: function() { return ""; },
        
        _createTreeNode: function(args) {
            return new FixedTreeNode(args);
        }
    });
});
