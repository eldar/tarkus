define([
    "dojo",
    "sumo",
    "pilot/canon",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ui/Keyboard",
    "ide/core/Environment",
    "ide/core/MainArea",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "sumo/ui/TemplatedWidget",
    "text!ide/find/QuickFind.html",
    "dijit/form/TextBox",
    "sumo/ui/ToolButton"
], function(dojo, sumo, canon, editor, renderer, theme,
    keyboard, env, mainArea,
    BorderContainer, ContentPane, TemplatedWidget, QuickSearchTemplate) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;

    var FindBar = dojo.declare(TemplatedWidget, {
        templateString: QuickSearchTemplate,
        
        postCreate: function() {
            this.connect(this.findTextBox, "onKeyPress", "onFindKeyPressHandler");
            this._findText = "";
        },
        
        closePane: function() {
            var bc = this._borderContainer;
            bc._setVisible(bc.bottomPane, false);
            this.ace().focus();
        },
        
        onFindKeyPressHandler: function(e) {
            switch(e.charOrCode) {
                case dojo.keys.ENTER:
                    this.findNext();
                    break;
                case dojo.keys.ESCAPE:
                    this.closePane();
                    break;
            };
        },
        
        ace: function() {
            return editor.current().editor;
        },
        
        initFind: function(text) {
            this.findTextBox.focus();
            if(text)
                this.findTextBox.set("value", text);
            this.findTextBox.focusNode.select();
        },
        
        findNext: function() {
            if(this._findText !== this.findTextBox.get("value")) {
                this.find();
            } else {
                this.ace().findNext();
            }
        },
        
        findPrevious: function() {
            this.ace().findPrevious()
        },
        
        find: function() {
            var ace = editor.current().editor;
            this._findText = this.findTextBox.get("value");
            ace.find(this._findText, {
              backwards: false,
              wrap: true,
              caseSensitive: false,
              wholeWord: false,
              regExp: false
            });
        }
    });
    
    var AceWidget = dojo.declare(dijit._Widget,
    {
        editor: null,

        postCreate : function()
        {
            this.editor = new Editor(new Renderer(this.domNode, theme));
        },

        resize: function()
        {
            this.editor.resize();
        }
    });
    
    var EditorComponent = dojo.declare(BorderContainer, {
        gutters: false,
        style: "border: 0px; height: 100%; ",
        
        postCreate: function() {
            this.inherited(arguments);

            this.centerPane = new ContentPane({
                region: "center", style:"padding: 0px;"
            });
            this.addChild(this.centerPane);
            
            this.bottomPane = new ContentPane({
                region: "bottom", splitter: false, style:"padding: 0px;"
            });
            this.addChild(this.bottomPane);
            
            var self = this;
            this.findBar = new FindBar({
                _borderContainer: self,
                _contentPane: this.bottomPane
            }).placeAt(this.bottomPane.domNode);
            
            this._setVisible(this.bottomPane, false);
            
            var aceWidget = new AceWidget({_borderContainer: self}).placeAt(this.centerPane.domNode);

            dojo.style(aceWidget.domNode, {
                "height": "100%",
                "width": "100%"
            });
            aceWidget.resize();
            aceWidget.editor.renderer.setHScrollBarAlwaysVisible(false);
            
            this.editor = aceWidget.editor;
        },
        
        _setVisible: function(widget, visible) {
            sumo.setVisible(widget.domNode, visible);
            this.resize();
        },
        
        setVisible: function(visible) {
            this._setVisible(this, visible);
        },
        
        initFind: function() {
            var ace = this.editor;
            var text = ace.getSession().doc.getTextRange(ace.getSelectionRange());
            this._setVisible(this.bottomPane, true);
            this.findBar.initFind(text);
        }
    });

    var ideEditor = new EditorComponent().placeAt(mainArea.center.domNode);
    ideEditor.setVisible(false);

    canon.addCommand({
        name: 'Find in Current File',
        bindKey: {
            win: 'Ctrl-F',
            mac: 'Command-F',
            sender: "editor"
        },
        exec: function(env, args, request) {
            var aceWidget = dijit.getEnclosingWidget(env.editor.container);
            var editorComponent = aceWidget._borderContainer;
            editorComponent.initFind();
        }
    });

    keyboard.bind(["Ctrl-F", "Command-F"], document, function(event) {
        event.preventDefault();
    });

    return EditorComponent;
});
