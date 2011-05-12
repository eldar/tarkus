var deps = [
    "jquery",
    "core/global"
];

define(deps, function($, global) {
    var OpenedDocuments = Backbone.Model.extend({
        // Contains an array of { node, session } objects
        _docs: [],
        _currentEntry: null,
        
        open: function(node) {
            if(this.getEntryByNode(node))
                return;
            var docEntry = {
                node: node,
                session: global.env.getSession(node.docType)
            };
            this._docs.push(docEntry);
            this.change({
                command: "add",
                node: docEntry
            });
        },
        
        setCurrentDocument: function(node) {
            this._currentEntry = this.getEntryByNode(node);
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
        
        getEntryByNode: function(node) {
            var len = this._docs.length;
            for(var i = 0; i < len; i++) {
                var entry = this._docs[i];
                if(node == entry.node)
                    return entry;
            }
            return null;
        },
        
        closeDocument: function(id) {
            var entry = this.getEntryById(id);
            var i = this._docs.indexOf(entry);
            this._docs.splice(i, 1);
//            var nextIndex = (i == this._docs.length) ? (i - 1) : i;
//            this.setCurrentDocument(this._docs[nextIndex]);
        }
    });
    
    return new OpenedDocuments;
});
