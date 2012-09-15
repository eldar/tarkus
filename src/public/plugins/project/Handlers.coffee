define [
  "dojo",
  "core/Ide",
  "core/Io",
  "sumo/core/ModelBase",
  "util/sprintf",
  "sumo/ui/TemplatedWidget",
  "ui/List",
  "dijit/Dialog",
  "ui/ConfirmDialog",
  "text!plugins/project/OpenProjectDialog.html"
  ], (dojo, ide, socketIo, Model, str, TemplatedWidget, List, Dialog,
    ConfirmDialog, OpenProjectTemplate) ->

  init: ->
    model = ide.query "project.model"
    tree = ide.query "project.tree"
    actions = ide.query "actions"
    OpenDialog = dojo.declare(Dialog,
      content: new TemplatedWidget(
        templateString: OpenProjectTemplate
        postCreate: ->
          self = this
          @listData = new Model.ListModel()
          @list = new List(
            model: @listData
            onDblClick: ->
              self.getParent().hide()
              self.onOk()
          , @listWidgetNode)

        getParent: ->
          dijit.getEnclosingWidget @domNode.parentNode

        onOk: ->
          name = _.last(@list.get "path").name
          @getParent().itemSelected name
      )
      title: "Open Project"
      style: "width: 200px;"
    )
    openDialog = new OpenDialog()
    openDialog.startup()
    dojo.connect openDialog, "itemSelected", (name) ->
      return  unless name
      model.openProject name, (node) ->
        treeNodes = tree.getNodesByItem node
        tree._expandNode _.first(treeNodes), false

    dojo.connect actions.file.openProject, "triggered", ->
      socketIo.request "getProjectList", {}, (e) ->
        openDialog.content.listData.setData e.data.list
        openDialog.show()

    dojo.connect actions.file.newProject, "triggered", ->
      name = prompt("Please, select project name")
      return  unless name
      node = model.creteNewProject(name)
      tree.set "path", [model.root(), node]

    newSomething = (isFile) ->
      selected = tree.selectedDataNode()
      return  unless selected
      parent = (if selected.isFolder() then selected else selected.parent)
      fileName = prompt(str.sprintf("Please, select %s name", (if isFile then "file" else "folder")))
      return  unless fileName
      if model.findFile(parent, fileName)
        alert "File with name " + name + " already exists"
        return
      node = model.createNewNode fileName, parent, isFile
      tree.set "path", node.fullObjectPath()
      node

    dojo.connect actions.file.newFile, "triggered", ->
      node = newSomething true
      model.openAndSelectDocument node

    dojo.connect actions.file.newFolder, "triggered", ->
      newSomething false

    confirmDialog = new ConfirmDialog.Multi()
    confirmDialog.startup()
    dojo.connect actions.file.closeProject, "triggered", ->
      model.closeCurrentProject dojo.hitch(confirmDialog, "promptClose")
