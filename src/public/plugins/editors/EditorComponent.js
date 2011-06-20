define([
    "dojo",
    "sumo",
    "pilot/canon",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ui/Keyboard",
    "ui/FindBar",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/_LayoutWidget"
], function(dojo, sumo, canon, editor, renderer, theme,
            keyboard, FindBar, BorderContainer, ContentPane, _LayoutWidget) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;

    // Simple widget that just wraps Ace editor into dijit._Widget
    var AceWidget = dojo.declare(_LayoutWidget,
    {
        editor: null,

        postCreate : function()
        {
            this.editorNode = dojo.create("div");
            dojo.place(this.editorNode, this.domNode);
            dojo.style(this.editorNode, {
                "height": "100%",
                "width": "100%"
            });
            this.editor = new Editor(new Renderer(this.editorNode, theme));
        },

        resize: function()
        {
            this.inherited(arguments);
            this.editor.resize();
        }
    });
    
    // Editor component that contains the actual ace widget and a find bar in the bottom    
    var EditorComponent = dojo.declare(BorderContainer, {
        gutters: false,
        style: "border: 0px; height: 100%; ",
        
        postCreate: function() {
            this.inherited(arguments);

            var self = this;
            var aceWidget = new AceWidget({_borderContainer: self, region: "center", style:"padding: 0px;"});//.placeAt(this.centerPane.domNode);
            this.addChild(aceWidget);

            this.bottomPane = new ContentPane({
                region: "bottom", splitter: false, style:"padding: 0px;"
            });
            this.addChild(this.bottomPane);
            this._setVisible(this.bottomPane, false);

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
