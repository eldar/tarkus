define([
    "sumo"
    "plugins/documents/OpenDocs"
    "plugins/documents/OpenDocsWidget"
    "plugins/documents/TabView"
    "ui/ConfirmDialog"
], (sumo, OpenDocuments, OpenDocsWidget, TabView, ConfirmDialog) ->

    init: () ->
        ide = require "core/Ide"
        openDocs = new OpenDocuments;
        ide.register "openDocs", openDocs

        saveAct = ide.query("actions").file.save
        
        updateSaveSensitivity = (doc) ->
            saveAct.set "disabled", if doc then !doc.isModified() else true

        dojo.connect saveAct, "triggered", () ->
            openDocs.saveCurrentDocument()

        dojo.connect openDocs, "onChange", (doc) ->
            updateSaveSensitivity(doc)

        dojo.connect openDocs, "currentDocChanged", (doc) ->
            text = "Save"
            if doc then text += " \"" + openDocs.getLabel(doc) + "\""
            saveAct.set "label", text
            updateSaveSensitivity doc

        confirmDialog = new ConfirmDialog.Single()
        confirmDialog.startup()
        confirmDialog.closeWithPrompt = (item) ->
            openDocs.closeDocumentPrompt item, dojo.hitch(confirmDialog, "promptClose")

        ide.register "documents.confirmDialog", confirmDialog

        mainArea = ide.query "mainArea"
        widget = new OpenDocsWidget { model: openDocs }
        widget.placeAt mainArea.left.bottom.domNode

        tabs = new TabView
            model: openDocs
            tabPosition: "top"
            useMenu: true
            dir: "ltr"
            tabPosition: false
            nested:false

        tabs.placeAt mainArea.tabPane.domNode

        updateTabPane = (size) ->
            sumo.setVisible mainArea.tabPane.domNode, size > 0
            mainArea.centerContainer.resize()
     
        updateTabPane 0
        dojo.connect tabs, "sizeChanged", (size) ->
            updateTabPane size
)
