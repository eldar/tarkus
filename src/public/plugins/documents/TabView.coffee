define [
    "dojo"
    "dijit/layout/ScrollingTabController"
], (dojo, TabController) ->
    
    ide = require "core/Ide"
    
    dojo.declare dijit.layout.ScrollingTabController, 
        postCreate: () ->
            @_docToButton = {}
            @inherited arguments
            @connect @model, "rowInserted", "onInsertRow"
            @connect @model, "rowRemoved", "onRemoveRow"
            @connect @model, "onChange", "updateDocument"
            @connect @model, "currentDocChangedForView", (doc) =>
                @selectButton @_docToButton[doc.id] if doc
            @confirmDialog = ide.query "documents.confirmDialog"
            
        updateDocument: (doc) ->
            button = @_docToButton[doc.id]
            button.set "label", @model.getLabel doc
            button.set "title", @model.getToolTip doc
            
        onCloseButtonClick: (page) ->
            @confirmDialog.closeWithPrompt page

        onButtonClick: (page) ->

        onInsertRow: (row, item) ->
            button = new @buttonWidget
                label: @model.getLabel item
                showLabel: true
                closeButton: true
                title: @model.getToolTip item
                dir: "ltr"

            button.page = item
            @_docToButton[item.id] = button
            
            button.focusNode.setAttribute "aria-selected", "false"
            
            @connect button, "onMouseDown", () =>
                @model.setCurrentDocument item

            @connect button, "onMouseUp", (event) =>
                @model.focusEditor item
                dojo.stopEvent event

            @addChild(button, row)
            dojo.style @containerNode, "width", (dojo.style(@containerNode, "width") + 200) + "px"
            @emitSizeChanged()
        
        emitSizeChanged: () ->
            @sizeChanged @model.root().children.length

        sizeChanged: (size) ->
        
        selectButton: (button) ->
            return if @_currentButton == button
              
            if @_currentButton
                oldButton = @_currentButton
                oldButton.set "checked", false
                oldButton.focusNode.setAttribute "aria-selected", "false"
                oldButton.focusNode.setAttribute "tabIndex", "-1"

            @_currentButton = button
            button.set "checked", true
            button.focusNode.setAttribute "aria-selected", "true"
            button.focusNode.setAttribute "tabIndex", "0"

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
