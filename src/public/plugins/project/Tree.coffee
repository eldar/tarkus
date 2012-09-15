define [
  "dojo",
  "dojo/_base/declare",
  "dijit/Tree",
  "dijit/Menu",
  "ui/FixedTreeNode",
  "ui/ResizableTextBox",
  "plugins/project/Nodes"
], (dojo, declare, Tree, Menu, FixedTreeNode, ResizableTextBox, nodes) ->

  ide = require "core/Ide"
  Type = nodes.Type

  ContextMenu = declare Menu,
    postCreate: ->
      tree = @tree
      @addChild new dijit.MenuItem
        label: "Rename"
        onClick: ->
          tree._selectedProjectItem.createEditBox()

      @addChild new dijit.MenuItem
        label: "Delete"
        onClick: ->
          node = tree._selectedProjectItem.item
          tree.model.deleteNode node  if node.type isnt Type.Project

  TreeEditBox = declare ResizableTextBox,
    postCreate: ->
      @inherited arguments
      (for name in ["onmousedown", "onmouseup", "onclick", "onkeypress"]
        @connect @domNode, name, (evt) ->
          evt.stopPropagation()
          return)
      @connect this, "onKeyPress", "onKeyPressHandler"
      @connect this, "onBlur", "onBlurHandler"

    #this.watch("value", function (propName, oldValue, newValue) { ... })
    onKeyPressHandler: (e) ->
      @inherited arguments
      result =
        switch e.charOrCode
          when dojo.keys.ENTER then 2
          when dojo.keys.ESCAPE then 1
          else 0
      @_scheduleFinish result > 1  if result > 0

    onBlurHandler: (e) ->
      @inherited arguments
      @_scheduleFinish true

    _scheduleFinish: (success) ->
      unless @_finishTimer
        @_finishTimer = setTimeout(=>
          delete @_finishTimer
          @treeItem.onEditingFinished success
        , 0)

  ProjectNode = declare FixedTreeNode,
    postCreate: ->
      dojo.connect @rowNode, "oncontextmenu", dojo.hitch(this, "onContextMenu")

    onContextMenu: (e) ->
      @tree._selectedProjectItem = this
      @tree.set "path", @item.fullObjectPath()
      @tree._contextMenu._scheduleOpen e.target, `undefined`,
        x: e.pageX
        y: e.pageY

      dojo.stopEvent e

    _onDblClick: (evt) ->
      @tree._onDblClick this, evt  unless @_supressEvents

    createEditBox: ->
      @_supressEvents = true
      dojo.style @labelNode,
        display: "none"

      self = this
      @textBox = new TreeEditBox
        treeItem: self
        name: "editName"
        value: @tree.model.getLabel @item
        style: #FIXME remove styling into css
          marginLeft: "4px"
          marginRight: "4px"

      @textBox.placeAt @labelNode, "before"
      @textBox.startup()
      @textBox.focus()

    onEditingFinished: (success) ->
      return  unless @textBox
      newValue = @textBox.attr "value"
      @textBox.destroy()
      oldValue = @tree.model.getLabel @item
      @tree.model.setLabel @item, newValue  if success and (oldValue isnt newValue)
      dojo.style @labelNode,
        display: "inline"

      delete @_supressEvents

  ProjectTree = declare Tree,
    autoExpand: false
    showRoot: false
    persist: false
    _selectedProjectItem: null

    postCreate: ->
      @inherited arguments
      @_contextMenu = new ContextMenu(tree: this)

    _createTreeNode: (args) -> new ProjectNode(args)

    getIconClass: (node, opened) ->
      return ""  if node.type is Type.File
      (if (not node or @model.mayHaveChildren(node)) and opened then "dijitFolderOpened" else "dijitFolderClosed")

    getIconStyle: (node) ->
      return {}  if node.type isnt Type.File
      backgroundImage: "url('" + @getIconUrl(node) + "')"
      height: "16px"
      width: "16px"

    getIconUrl: (node) ->
      switch node.docType
        when "js" then "icons/images/js.png"
        when "css" then "icons/images/css.png"
        when "html" then "icons/images/html.png"
        else "icons/images/unknown.png"

    onDblClick: (node) ->
      @model.openAndSelectDocument node

    onClick: (node) ->
      action = ide.query("actions").file.closeProject
      action.set "label", "Close Project \"" + node.getProject().name + "\""
      action.set "disabled", false
      @model.updateCurrentProject node

    selectedDataNode: ->
      path = @get "path"
      return null  if path.length is 0
      _.last path
