var deps = [
    "jquery",
    "core/global"
];

define(deps, function($, global) {
    var OpenedDocuments = Backbone.Model.extend({
        // Contains an array of { node, session } objects
        _docs: [],
        
        open: function(docEntry) {
            this._docs.push(docEntry);
            this.change({
                command: "add",
                node: docEntry
            });
        },
        
        setCurrentDocument: function(node) {
            this.trigger("documentSelectedForView", node.id);
        },
        
        setCurrentDocumentById: function(id) {
            this.trigger("documentSelected", id);
            var entry = this.getEntryById(id);
            global.env.editor.setSession(entry.session);
        },
        
        
        getEntryById: function(id) {
            var len = this._docs.length;
            for(var i = 0; i < len; i++) {
                var entry = this._docs[i];
                if(id == entry.node.id)
                    return entry;
            }
            return null;
        },
        
        closeDocument: function(id) {
            var entry = this.getEntryById(id);
            var i = this._docs.indexOf(entry);
            this._docs.splice(i, 1);
        }
    });
    
    return new OpenedDocuments;
});
