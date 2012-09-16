define [
  "plugins/project/Model",
  "plugins/project/Tree",
  "plugins/project/Handlers"
], (ProjectModel, ProjectTree, Handlers) ->

  ide = require "core/Ide"
  
  init: ->
    openDocs = ide.query "openDocs"
    model = new ProjectModel openDocs
    ide.register "project.model", model
    tree = new ProjectTree(model: model)
    mainArea = ide.query "mainArea"
    tree.placeAt mainArea.left.top.domNode
    tree.initMenus()
    mainArea.left.top.resize() # otherwise the tree scrollbars doesn't appear until next resize
    ide.register "project.tree", tree
    Handlers.init()
