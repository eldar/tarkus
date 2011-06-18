define([
    "dojo",
    "sumo",
    "pilot/canon",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ui/Keyboard",
    "ui/FindBar",
    "ide/core/Environment",
    "ide/core/MainArea",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"
], function(dojo, sumo, canon, editor, renderer, theme,
    keyboard, FindBar, env, mainArea,
    BorderContainer, ContentPane) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;

    // Simple widget that just wraps Ace editor into dijit._Widget
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
    
    // Editor component that contains the actual ace widget and a find bar in the bottom    
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
            this._setVisible(this.bottomPane, false);
            
            var self = this;
            var aceWidget = new AceWidget({_borderContainer: self}).placeAt(this.centerPane.domNode);

            dojo.style(aceWidget.domNode, {
                "height": "100%",
                "width": "100%"
            });
            aceWidget.resize();
            aceWidget.editor.renderer.setHScrollBarAlwaysVisible(false);
            
            this.editor = aceWidget.editor;

            var ace = this.editor;

            this.findBar = new FindBar({
                closePane: function() {
                    self._setVisible(self.bottomPane, false);
                    ace.focus();
                },
                
                doFind: function(text) {
                    ace.find(text, {
                      backwards: false,
                      wrap: true,
                      caseSensitive: false,
                      wholeWord: false,
                      regExp: false
                    });
                },
                
                findNext: function() {
                    ace.findNext();
                },
                
                findPrevious: function() {
                    ace.findPrevious();
                }
            }).placeAt(this.bottomPane.domNode);
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
