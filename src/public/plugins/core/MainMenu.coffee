define ["dojo", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator", "dijit/PopupMenuItem"], (dojo, Menu, MenuItem, MenuSeparator, PopupMenuItem) ->
  ide = require("core/Ide")
  init: ->
    actions = ide.query "actions"

    menuBar = dijit.byId "menuBar"
    fileMenu = dijit.byId "fileMenu"

    fileNew = new Menu()
    fileNew.addChild actions.file.newProject.makeMenuItem(label: "Project...")
    fileNew.addChild actions.file.newFile.makeMenuItem(label: "File...")
    fileNew.addChild actions.file.newFolder.makeMenuItem(label: "Folder")
    fileMenu.addChild new PopupMenuItem(
      label: "New"
      popup: fileNew
    )

    fileMenu.addChild actions.file.openProject.makeMenuItem()
    fileMenu.addChild actions.file.save.makeMenuItem()
    fileMenu.addChild new MenuSeparator()
    fileMenu.addChild actions.file.closeProject.makeMenuItem()

    editMenu = dijit.byId "editMenu"
    editMenu.addChild actions.edit.cut.makeMenuItem()
    editMenu.addChild actions.edit.copy.makeMenuItem()
    editMenu.addChild actions.edit.paste.makeMenuItem()
    
    # Toolbar
    menuBar.addChild actions.file.save.makeToolButton()
