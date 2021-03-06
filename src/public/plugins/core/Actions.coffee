define ["ui/Action"], (Action) ->

  ide = require "core/Ide"

  init: ->
    actions =
      file:
        newProject: new Action(label: "New Project...")
        newFile: new Action(label: "New File...")
        newFolder: new Action(label: "New Folder...")
        openProject: new Action(label: "Open Project...")

        save: new Action
          label: "Save"
          iconClass: "dijitEditorIcon dijitEditorIconSave"
          disabled: true
          keyBinding:
            win: "Ctrl-S"
            mac: "Command-S"

        closeProject: new Action
          label: "Close Project"
          disabled: true

      edit:
        cut: new Action(label: "Cut")
        copy: new Action(label: "Copy")
        paste: new Action(label: "Paste")

    ide.register "actions", actions
