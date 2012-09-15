define ["dojo", "dojo/parser", "dijit", "text!templates/ide-body.html", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/MenuBar", "dijit/PopupMenuBarItem", "dijit/ToolbarSeparator", "dijit/form/Button"], (dojo, parser, dijit, bodyView) ->
  init: ->
    dojo.html.set dojo.body(), bodyView
    parser.parse()
    mainArea =
      container: dijit.byId "mainLayout"
      left:
        top: dijit.byId "leftTopPane"
        bottom: dijit.byId "leftBottomPane"

      center: dijit.byId "centerPane"
      editorPane: dijit.byId "editorPane"
      tabPane: dijit.byId "tabPane"
      centerContainer: dijit.byId "centerContainer"

    ide = require "core/Ide"
    ide.register "mainArea", mainArea
