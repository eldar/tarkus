define ["dojo", "sumo", "pilot/canon", "ace/editor", "ace/virtual_renderer", "ace/theme/textmate", "ui/Action", "ui/FindBar", "dijit/layout/BorderContainer", "dijit/layout/ContentPane"], (dojo, sumo, canon, editor, renderer, theme, Action, FindBar, BorderContainer, ContentPane) ->
  Editor = editor.Editor
  Renderer = renderer.VirtualRenderer
  
  # Simple widget that just wraps Ace editor into dijit._Widget
  AceWidget = dojo.declare(ContentPane,
    editor: null
    postCreate: ->
      @editorNode = dojo.create("div")
      dojo.place @editorNode, @domNode
      dojo.style @editorNode,
        height: "100%"
        width: "100%"

      @editor = new Editor(new Renderer(@editorNode, theme))
      @editor.setFontSize "14px"

    resize: ->
      @inherited arguments
      @editor.resize()
  )
  
  # Editor component that contains the actual ace widget and a find bar in the bottom    
  EditorComponent = dojo.declare(BorderContainer,
    gutters: false
    style: "height: 100%;"
    postCreate: ->
      @inherited arguments
      self = this
      aceWidget = new AceWidget( #.placeAt(this.centerPane.domNode);
        _borderContainer: self
        region: "center"
        style: "padding: 0px;"
      )
      @addChild aceWidget
      ace = aceWidget.editor
      ace.renderer.setHScrollBarAlwaysVisible false
      @editor = ace
      @findBar = new FindBar(
        region: "bottom"
        splitter: false
        style: "padding: 0px;"
        closePane: ->
          self._setVisible this, false
          ace.focus()

        getSearchOptions: ->
          backwards: false
          wrap: true
          caseSensitive: false
          wholeWord: false
          regExp: false
          needle: @getFindText()

        findNext: ->
          ace.find @getFindText(), @getSearchOptions()

        findPrevious: ->
          options = @getSearchOptions()
          options.backwards = true
          ace.findPrevious options

        replace: ->
          range = ace.getSelectionRange()
          selected = ace.getSession().doc.getTextRange(range)
          replacement = @getReplaceText()
          needle = @getFindText()
          ace.$search.set @getSearchOptions()
          if selected isnt needle
            range = ace.$search.find(ace.session)
          else
            ace.$tryReplace range, replacement
            range = ace.$search.find(ace.session)
            ace.selection.setSelectionRange range

        replaceAll: ->
          ace.replaceAll @getReplaceText(), @getSearchOptions()
      )
      @addChild @findBar
      @_setVisible @findBar, false
      dojo.addClass @domNode, "editorPane"

    _setVisible: (widget, visible) ->
      sumo.setVisible widget.domNode, visible
      @resize()

    setVisible: (visible) ->
      @_setVisible this, visible

    initFind: ->
      ace = @editor
      text = ace.getSession().doc.getTextRange(ace.getSelectionRange())
      @_setVisible @findBar, true
      @findBar.initFind text
  )
  findAction = new Action(
    label: "Find in Current File"
    keyBinding:
      win: "Ctrl-F"
      mac: "Command-F"
      extent: Action::EDITOR
  )
  dojo.connect findAction, "triggered", (env) ->
    aceWidget = dijit.getEnclosingWidget(env.editor.container)
    editorComponent = aceWidget._borderContainer
    editorComponent.initFind()

  EditorComponent
