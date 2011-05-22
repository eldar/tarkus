var deps = [
    "jquery",
    "core/global",
    "core/io"
];

define(deps, function($, global, socketIo) {
    var OpenDocuments = Backbone.Model.extend({
        // Contains an array of { node, session } objects
        _docs: [],
        _currentEntry: null,
        
        open: function(node, content) {
            if(this.entryByNode(node))
                return;
            var docEntry = {
                node: node,
                session: global.env.getSession(node.docType, content),
                id: _.uniqueId("open_doc_") // id of the opened document, not to be confused with node.id
            };
            this._docs.unshift(docEntry);
            this.change({
                command: "add",
                node: docEntry
            });
        },
        
        setCurrentDocument: function(node) {
            var newEntry = this.entryByNode(node)
            if(this._currentEntry == newEntry)
                return;
            this._currentEntry = newEntry;
            this.trigger("documentSelectedForView", newEntry.id);
        },
        
        setCurrentDocumentById: function(id) {
            var entry = this.entryById(id);
            global.env.setEditorVisible(true);
            global.env.editor.setSession(entry.session);
            this.trigger("documentSelected", entry.node.id);
        },
        
        entryById: function(id) {
            var len = this._docs.length;
            for(var i = 0; i < len; i++) {
                var entry = this._docs[i];
                if(id == entry.id)
                    return entry;
            }
            return null;
        },
        
        entryByNode: function(node) {
            var len = this._docs.length;
            for(var i = 0; i < len; i++) {
                var entry = this._docs[i];
                if(node == entry.node)
                    return entry;
            }
            return null;
        },
        
        closeDocumentByNode: function(node) {
            var entry = this.entryByNode(node);
            if(entry)
                this.closeDocument(entry.id);
        },
        
        closeDocument: function(id) {
            var entry = this.entryById(id);
            if(!entry)
                return;
            var isSelected = (entry == this._currentEntry);
            var i = this._docs.indexOf(entry);
            this._docs.splice(i, 1);
            this.trigger("documentClosed", id);
            if(this._docs.length == 0) {
                global.env.editor.setSession(global.env.getEmptySession());
                global.env.setEditorVisible(false);
                this._currentEntry = null;
                return;
            }
            if(isSelected) {
                var nextIndex = (i == this._docs.length) ? (i - 1) : i;
                this.setCurrentDocument(this._docs[nextIndex].node);
            }
        },
        
        handleNodeRenamed: function(node) {
            var entry = this.entryByNode(node);
            entry.session.setMode(global.env.modeForDocType(node.docType));
        },
        
        saveNode: function() {
            var entry = this._currentEntry;
            if(!entry)
                return;
            var object = _.extend(entry.node.pathDefinition(), {
                content: entry.session.getValue()
            });
            socketIo.send("saveFile", object);
        }
    });
    
    var openDocs = new OpenDocuments;
    
    return openDocs;
});
