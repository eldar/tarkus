define([
    "dojo"
    "sumo"
    "core/Io"
    "sumo/core/ModelBase"
], (dojo, sumo, socketIo, Model) ->

    ide = require "core/Ide"

    getCurrentDelta = (session) ->
        stack = session.getUndoManager().$undoStack
        len = stack.length
        (len == 0) ? null : stack[len - 1];

    Document = dojo.declare null,
        constructor: (node, session) ->
            @node = node;
            @session = session
            sumo.makeUnique this, "od_"
        
        setInitialSaveState: () ->
            @lastSaved = getCurrentDelta @session
            @_isModified = false
        
        name: () -> @node.name
        
        isModified: () -> @_isModified

    
    OpenDocuments = dojo.declare Model.ModelBase,
        constructor: () ->
            @_fakeRoot = new Document null, null
            @_fakeRoot.children = []
        
        root: () -> @_fakeRoot
        
        list: () -> @root().children
        
        getLabel: (doc) ->
            node = doc.node;
            if node
                (if doc.isModified() then "*" else "") + node.name;
            else
                ""
        
        _currentDoc: null
        
        editors: () -> ide.query("editors")
        
        open: (node, content) ->
            if @docByNode node
                return
            session = @editors().getSession node.docType, content
            doc = new Document node, session
            session.getUndoManager().on "change", () =>
                doc._isModified = (doc.lastSaved != getCurrentDelta session)
                @onChange doc

            previousSize = @list().length
            @list().push doc
            @notifyInsertRow previousSize, doc

        notifyInsertRow: (row, item) ->
            @rowInserted row, item
            @notifyChildrenChanged @root()
        
        rowInserted: (row, item) ->

        notifyRemoveRow: (row) ->
            @rowRemoved row
            @notifyChildrenChanged @root()
        
        rowRemoved: (row) ->
        
        getToolTip: (doc) -> doc.node.fullPath()
        
        focusEditor: () ->
            @editors().current().editor.focus()
        
        setCurrentDocumentByNode: (node) ->
            @setCurrentDocument @docByNode node
        
        setCurrentDocument: (newDoc) ->
            ace = @editors().current()
            ace.editor.focus()
            if @_currentDoc == newDoc
                return
            @_currentDoc = newDoc
            ace.setVisible true
            ace.editor.setSession newDoc.session
            ace.resize()
            @currentDocChanged newDoc

        currentDocChanged: (doc) ->
            @currentDocChangedForView doc
        
        currentDocChangedForView: () ->
        
        docByNode: (node) ->
            for doc in @list()
                if node == doc.node then return doc
            null

        closeDocumentPrompt: (doc, prompt) ->
            if not doc then return

            if doc.isModified()
                prompt doc.name(), (save) =>
                    if save
                        @saveDocument doc
                    @closeDocument doc
            else
                @closeDocument doc

        closeDocument: (doc) ->
            if not doc then return
            
            isSelected = (doc == @_currentDoc)

            # delete document from the model
            list = @list()
            i = list.indexOf doc
            list.splice i, 1
            @notifyRemoveRow doc

            # hide the Editor widget and set current document to null
            if list.length == 0
                ace = @editors().current()
                ace.editor.setSession @editors().getEmptySession()
                ace.setVisible false
                @_currentDoc = null
                @currentDocChanged null
                return

            # select next document after the closed one
            if isSelected
                nextIndex = if (i == list.length) then (i - 1) else i
                @setCurrentDocument list[nextIndex]
            else
                # dojo for some reason deselects element after we rehashed all the content of the widget so just make sure we select it again
                @currentDocChangedForView @_currentDoc

        handleNodeChange: (node) ->
            doc = @docByNode node
            if not doc then return
            doc.session.setMode @editors().modeForDocType(node.docType)
            @onChange doc
        
        saveCurrentDocument: () ->
            if @_currentDoc then @saveDocument @_currentDoc
        
        saveDocument: (doc) ->
            if not doc.isModified() then return
            doc.setInitialSaveState()
            @onChange doc
            object = _.extend doc.node.pathDefinition(),
                content: doc.session.getValue()
            socketIo.send "saveFile", object
)
