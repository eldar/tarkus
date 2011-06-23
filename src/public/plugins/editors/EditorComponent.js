define([
    "dojo",
    "sumo",
    "pilot/canon",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ui/Action",
    "ui/FindBar",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"
], function(dojo, sumo, canon, editor, renderer, theme,
            Action, FindBar, BorderContainer, ContentPane) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;

    // Simple widget that just wraps Ace editor into dijit._Widget
    var AceWidget = dojo.declare(ContentPane,
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
        style: "height: 100%;",
        
        postCreate: function() {
            this.inherited(arguments);

            var self = this;
            var aceWidget = new AceWidget({_borderContainer: self, region: "center", style:"padding: 0px;"});//.placeAt(this.centerPane.domNode);
            this.addChild(aceWidget);

            var ace = aceWidget.editor;
            ace.renderer.setHScrollBarAlwaysVisible(false);
            this.editor = ace;

            this.findBar = new FindBar({
                region: "bottom",
                splitter: false,
                style: "padding: 0px;",
                
                closePane: function() {
                    self._setVisible(this, false);
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
            });
            
            this.addChild(this.findBar);
            this._setVisible(this.findBar, false);
            
            dojo.addClass(this.domNode, "editorPane");
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
            this._setVisible(this.findBar, true);
            this.findBar.initFind(text);
        }
    });
    
    var findAction = new Action({
        label: 'Find in Current File',
        keyBinding: {
            win: "Ctrl-F",
            mac: "Command-F",
            extent: Action.prototype.EDITOR
        }
    });
    
    dojo.connect(findAction, "triggered", function(env) {
        var aceWidget = dijit.getEnclosingWidget(env.editor.container);
        var editorComponent = aceWidget._borderContainer;
        editorComponent.initFind();
    });

    return EditorComponent;
});
