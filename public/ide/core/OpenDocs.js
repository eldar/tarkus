define([
    "dojo",
    "core/Global",
    "core/Io",
    "core/ModelBase",
    "ide/core/Editor"
], function(dojo, global, socketIo, ModelBase, editor) {

    var getCurrentDelta = function(session) {
        var stack = session.getUndoManager().$undoStack;
        var len = stack.length;
        return (len == 0) ? null : stack[len - 1];
    };

    var Document = dojo.declare(null, {
        constructor: function(node, session) {
            this.node = node;
            this.session = session;
            global.makeUnique(this, "od_");
        },
        
        setInitialSaveState: function() {
            this.lastSaved = getCurrentDelta(this.session);
            this.isModified = false;
        },
        
        name: function() {
            return node.name;
        }
    });
    
    var OpenDocuments = dojo.declare(ModelBase, {
        constructor: function() {
            this._fakeRoot = new Document(null, null);
            this._fakeRoot.children = [];
        },
        
        root: function() {
           return this._fakeRoot;
        },
        
        list: function() {
            return this.root().children;
        },
        
        getLabel: function(item) {
            var node = item.node;
            return node ? node.name : "";
        },
        
        _docs: [],
        _currentEntry: null,
        
        open: function(node, content) {
            if(this.entryByNode(node))
                return;
            var session = editor.getSession(node.docType, content);
            var entry = new Document(node, session);
            var self = this;
            session.getUndoManager().on("change", function() {
                entry.isModified = (entry.lastSaved != getCurrentDelta(session));
                self.entryChanged(entry);
            });
            this.list().unshift(entry);
            this.notifyChildrenChanged(this.root());
        },
        
        entryChanged: function(entry) {
        },
        
        setCurrentDocumentByNode: function(node) {
            this.setCurrentDocument(this.entryByNode(node));
        },
        
        setCurrentDocument: function(newEntry) {
            if(this._currentEntry == newEntry)
                return;
            this._currentEntry = newEntry;
            var ace = editor.current();
            ace.setVisible(true);
            ace.editor.setSession(newEntry.session);
            ace.resize();
            this.currentDocChanged(newEntry);
        },
        
        currentDocChanged: function() {
        },
        
        entryByNode: function(node) {
            var len = this.list().length;
            for(var i = 0; i < len; i++) {
                var entry = this.list()[i];
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
//            this.trigger("documentClosed", id);
            if(this._docs.length == 0) {
                global.env.editor.setSession(global.env.getEmptySession());
                global.env.setEditorVisible(false);
                this._currentEntry = null;
//                this.trigger("documentSelected", null);
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
            if(!entry.isModified)
                return;
            entry.setInitialSaveState();
            this.entryChanged(entry); 
            var object = _.extend(entry.node.pathDefinition(), {
                content: entry.session.getValue()
            });
            socketIo.send("saveFile", object);
        }
    });
    
    var openDocs = new OpenDocuments;
    
    return openDocs;
});
