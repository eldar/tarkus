define ["dojo", "ace/edit_session", "ace/mode/javascript", "ace/mode/coffee", "ace/mode/css", "ace/mode/html", "ace/mode/text", "ace/undomanager"], (dojo, editSession, jsMode, coffeeMode, cssMode, htmlMode, textMode, undoManager) ->
  EditSession = editSession.EditSession
  JavaScriptMode = jsMode.Mode
  CssMode = cssMode.Mode
  HtmlMode = htmlMode.Mode
  TextMode = textMode.Mode
  UndoManager = undoManager.UndoManager
  CoffeeMode = coffeeMode.Mode
  Editors = dojo.declare(null,
    _current: null
    current: ->
      @_current

    setCurrent: (newCurrent) ->
      @_current = newCurrent

    modeForDocType: (docType) ->
      mode = undefined
      switch docType
        when "js"
          mode = new JavaScriptMode()
        when "css"
          mode = new CssMode()
        when "html"
          mode = new HtmlMode()
        when "coffee"
          mode = new CoffeeMode()
        else
          mode = new TextMode()
      mode

    getSession: (docType, content) ->
      text = content or ""
      session = new EditSession(text)
      session.setMode @modeForDocType(docType)
      session.setUndoManager new UndoManager()
      session

    getEmptySession: ->
      new EditSession("")
  )
  Editors
