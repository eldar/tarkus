define([
    "dojo"
    "sumo"
    "dijit/layout/ContentPane"
    "dijit/_Templated"
    "text!ui/FindBar.html"
    "dijit/form/TextBox"
    "sumo/ui/ToolButton"
], (dojo, sumo, ContentPane, _Templated, FindBarTemplate) ->

    dojo.declare [ContentPane, _Templated],
        widgetsInTemplate: true
        templateString: FindBarTemplate
        
        postCreate: ->
            @connect @findTextBox, "onKeyPress", "onFindKeyPressHandler"
            @connect @replaceTextBox, "onKeyPress", "onReplaceKeyPressHandler"
        
        # Overridable functions
        
        closePane: ->
        findNext: ->
        findPrevious: ->
        replace: ->
        replaceAll: ->
        
        perform: (command) ->
        
        getFindText: -> @findTextBox.get("value")
        getReplaceText: -> @replaceTextBox.get("value")
        
        onFindKeyPressHandler: (e) ->
            switch e.charOrCode
                when dojo.keys.ENTER then @findNext()
                when dojo.keys.ESCAPE then @closePane()

        onReplaceKeyPressHandler: (e) ->
            switch e.charOrCode
                when dojo.keys.ENTER then @replace()
                when dojo.keys.ESCAPE then @closePane()

        initFind: (text) ->
            @findTextBox.focus()
            if text then @findTextBox.set "value", text
            @findTextBox.focusNode.select()
)
