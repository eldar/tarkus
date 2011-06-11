define([
    "dojo",
    "dijit/Tree"
], function(dojo, Tree) {
    return dojo.declare(Tree, {
        autoExpand: false,
        showRoot: false,
        persist: false,
        getIconClass: function() { return ""; }
    });
});
