define([
    "dojo"
    "sumo"
    "ui/List"
    "ui/FixedTreeNode"
], (dojo, sumo, List, FixedTreeNode, ConfirmDialog) ->
    
    ide = require "core/Ide"

    ClosableNode = dojo.declare FixedTreeNode,
        postCreate: () ->
            button = dojo.create "div",
                style:
                    float: "right"
                    display: "none"
                    marginRight: "5px"

            dojo.addClass button, "close-button"
            dojo.place button, @rowNode, "first"

            dojo.connect @domNode, "onmouseenter", () ->
                sumo.setVisible button, true

            dojo.connect @domNode, "onmouseleave", () ->
                sumo.setVisible button, false
            
            confirmDialog = ide.query "documents.confirmDialog"
            
            dojo.connect button, "onclick", (event) =>
                confirmDialog.closeWithPrompt @item
                dojo.stopEvent event

    OpenDocsWidget = dojo.declare List,
        constructor: (params) ->
            dojo.connect params.model, "currentDocChangedForView", (doc) =>
                if doc then @set "path", [@model.root(), doc]
        
        onClick: (doc) -> @model.setCurrentDocument doc
        
        _createTreeNode: (args) -> new ClosableNode args
)
