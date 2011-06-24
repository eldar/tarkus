define([
    "dojo"
    "dijit/layout/TabController"
], (dojo, TabController) ->
    ide = require "core/Ide"
    
    dojo.declare TabController, 
        postCreate: () ->
            @_docToButton = {}
            @inherited arguments
            @connect @model, "rowInserted", "onInsertRow"
            @connect @model, "rowRemoved", "onRemoveRow"
            @connect @model, "onChange", "updateDocument"
            @connect @model, "currentDocChangedForView", (doc) =>
                if(doc)
                    @selectButton(@_docToButton[doc.id]);
            
        updateDocument: (doc) ->
            button = @_docToButton[doc.id]
            button.set("label", @model.getLabel(doc))
            button.set("title", @model.getToolTip(doc))
            
        onInsertRow: (row, item) ->
            cls = dojo.getObject(@buttonWidget)
            button = new cls
                label: @model.getLabel(item)
                showLabel: true
                closeButton: true
                title: @model.getToolTip(item)
                dir: "ltr"

            button.__tarkus_document = item
            @_docToButton[item.id] = button
            
            button.focusNode.setAttribute("aria-selected", "false")
            
            confirmDialog = ide.query "documents.confirmDialog"

            @connect button, 'onMouseDown', () =>
                @model.setCurrentDocument button.__tarkus_document

            @connect button, 'onMouseUp', (event) =>
                @model.focusEditor button.__tarkus_document
                dojo.stopEvent event

            @connect button, 'onClickCloseButton', (event) =>
                confirmDialog.closeWithPrompt(button.__tarkus_document)
            
            @addChild(button, row)
            @emitSizeChanged()
        
        emitSizeChanged: () ->
            @sizeChanged @model.root().children.length

        sizeChanged: (size) ->
        
        selectButton: (button) ->
            if @_currentButton == button
                return
              
            if @_currentButton
                oldButton = @_currentButton
                oldButton.set('checked', false)
                oldButton.focusNode.setAttribute("aria-selected", "false")
                oldButton.focusNode.setAttribute("tabIndex", "-1")

            @_currentButton = button
            button.set('checked', true);
            button.focusNode.setAttribute("aria-selected", "true")
            button.focusNode.setAttribute("tabIndex", "0")

        onRemoveRow: (doc) ->
            # disconnect connections related to page being removed
#            dojo.forEach(this.pane2connects[page.id], dojo.hitch(this, "disconnect"));
#            delete this.pane2connects[page.id];

            button = @_docToButton[doc.id]
            if button
                @removeChild button
                delete @_docToButton[doc.id]
                button.destroy()
                @_currentButton = null
                @emitSizeChanged()
)
