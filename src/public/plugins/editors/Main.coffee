define ["plugins/editors/Editors", "plugins/editors/EditorComponent"], (Editors, EditorComponent) ->
  ide = require("core/Ide")
  init: ->
    editors = new Editors()
    ide.register "editors", editors
    mainArea = ide.query "mainArea"
    ideComponent = new EditorComponent().placeAt(mainArea.editorPane.domNode)
    ideComponent.startup()
    ideComponent.setVisible false
    editors.setCurrent ideComponent
