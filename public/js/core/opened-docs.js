var deps = [
    "jquery",
    "core/global"
];

define(deps, function($, global) {
    var OpenDocuments = Backbone.Model.extend({
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
            this._docs.unshift(docEntry);
            this.change({
                command: "add",
                node: docEntry
            });
        },
        
        setCurrentDocument: function(node) {
            var newEntry = this.getEntryByNode(node)
            if(this._currentEntry == newEntry)
                return;
            this._currentEntry = newEntry;
            this.trigger("documentSelectedForView", node.id);
        },
        
        setCurrentDocumentById: function(id) {
            var entry = this.getEntryById(id);
            global.env.setEditorVisible(true);
            global.env.editor.setSession(entry.session);
            this.trigger("documentSelected", id);
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
            var isSelected = (entry == this._currentEntry);
            var i = this._docs.indexOf(entry);
            this._docs.splice(i, 1);
            if(this._docs.length == 0) {
                global.env.editor.setSession(global.env.getEmptySession());
                global.env.setEditorVisible(false);
                return;
            }
            if(isSelected) {
                var nextIndex = (i == this._docs.length) ? (i - 1) : i;
                this.setCurrentDocument(this._docs[nextIndex].node);
            }
        },
        
        handleNodeRenamed: function(node) {
            var entry = this.getEntryByNode(node);
            entry.session.setMode(global.env.modeForDocType(node.docType));
        }
    });
    
    return new OpenDocuments;
});
