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
            this._isModified = false;
        },
        
        name: function() {
            return node.name;
        },
        
        isModified: function() {
            return this._isModified;
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
            if(node) {
                return node.name + (item.isModified() ? "*" : "");
            }
            else {
                return "";
            }
        },
        
        _currentDoc: null,
        
        open: function(node, content) {
            if(this.docByNode(node))
                return;
            var session = editor.getSession(node.docType, content);
            var doc = new Document(node, session);
            session.getUndoManager().on("change", dojo.hitch(this, function() {
                doc._isModified = (doc.lastSaved != getCurrentDelta(session));
                this.onChange(doc);
            }));
            this.list().unshift(doc);
            this.notifyChildrenChanged(this.root());
        },
        
        setCurrentDocumentByNode: function(node) {
            this.setCurrentDocument(this.docByNode(node));
        },
        
        setCurrentDocument: function(newDoc) {
            if(this._currentDoc == newDoc)
                return;
            this._currentDoc = newDoc;
            var ace = editor.current();
            ace.setVisible(true);
            ace.editor.setSession(newDoc.session);
            ace.resize();
            this.currentDocChanged(newDoc);
        },
        
        currentDocChanged: function(doc) {
            this.currentDocChangedForView(doc);
        },
        
        currentDocChangedForView: function() {
        },
        
        docByNode: function(node) {
            var len = this.list().length;
            for(var i = 0; i < len; i++) {
                var doc = this.list()[i];
                if(node == doc.node)
                    return doc;
            }
            return null;
        },
        
        closeDocumentByNode: function(node) {
            var doc = this.docByNode(node);
            if(doc)
                this.closeDocument(doc.id);
        },
        
        closeDocument: function(doc) {
            if(!doc)
                return;
            var isSelected = (doc == this._currentDoc);
            var list = this.list();
            var i = list.indexOf(doc);
            list.splice(i, 1);
            this.notifyChildrenChanged(this.root());

            if(list.length == 0) {
                var ace = editor.current();
                ace.editor.setSession(editor.getEmptySession());
                ace.setVisible(false);
                this._currentDoc = null;
                this.currentDocChanged(null);
                return;
            }
            if(isSelected) {
                var nextIndex = (i == list.length) ? (i - 1) : i;
                this.setCurrentDocument(list[nextIndex]);
            } else {
                // dojo for some reason deselects element after we rehashed all the content of the widget so just make sure we select it again
                this.currentDocChangedForView(this._currentDoc);
            }
        },
        
        handleNodeRenamed: function(node) {
            var doc = this.docByNode(node);
            doc.session.setMode(editor.modeForDocType(node.docType));
            this.onChange(doc);
        },
        
        saveNode: function() {
            var doc = this._currentDoc;
            if(!doc)
                return;
            if(!doc.isModified())
                return;
            doc.setInitialSaveState();
            this.onChange(doc); 
            var object = _.extend(doc.node.pathDefinition(), {
                content: doc.session.getValue()
            });
            socketIo.send("saveFile", object);
        }
    });
    
    var openDocs = new OpenDocuments;
    
    return openDocs;
});
