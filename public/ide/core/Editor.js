define([
    "dojo",
    "pilot/canon",
    "pilot/event",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ace/edit_session",
    "ace/mode/javascript",
    "ace/mode/css",
    "ace/mode/html",
    "ace/mode/text",
    "ace/undomanager",
    "core/Global",
    "ide/core/Environment",
    "ide/core/MainArea",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "ui/TemplatedWidget",
    "text!ide/find/QuickFind.html",
    "dijit/form/TextBox",
    "ui/ToolButton"
], function(dojo, canon, event, editor, renderer,
    theme, editSession, jsMode, cssMode, htmlMode, textMode, undoManager, global, env, mainArea,
    BorderContainer, ContentPane, TemplatedWidget, QuickSearchTemplate) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;
    var EditSession = editSession.EditSession;

    var JavaScriptMode = jsMode.Mode;
    var CssMode = cssMode.Mode;
    var HtmlMode = htmlMode.Mode;
    var TextMode = textMode.Mode;
    var UndoManager = undoManager.UndoManager;

    var bc = new BorderContainer({gutters: false, style: "border: 0px; height: 100%; " });
    bc.placeAt(mainArea.center.domNode);

    var setVisible = function(widget, visible) {
        dojo.setVisible(widget.domNode, visible);
        bc.resize();
    };

    var centerPane = new ContentPane({region: "center", style:"padding: 0px;"});
    bc.addChild(centerPane);
    
    var bottomPane = new ContentPane({
        region: "bottom", splitter: false, style:"padding: 0px;",
    });
    bc.addChild(bottomPane);

    var editor = null;

    var findBar = new TemplatedWidget({
        templateString: QuickSearchTemplate,
        
        postCreate: function() {
            this.connect(this.findTextBox, "onKeyPress", "onFindKeyPressHandler");
            this._findText = "";
        },
        
        closePane: function() {
            setVisible(bottomPane, false);
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

    findBar.placeAt(bottomPane.domNode);
    setVisible(bottomPane, false);
    
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
        },

        setVisible:  function(visible) {
            setVisible(bc, visible);
        }
    });
    
    var aceWidget = new AceWidget().placeAt(centerPane.domNode);
    dojo.style(aceWidget.domNode, {
        "height": "100%",
        "width": "100%"
    });
    aceWidget.resize();
    aceWidget.editor.renderer.setHScrollBarAlwaysVisible(false);
    aceWidget.setVisible(false);
    
    canon.addCommand({
        name: 'Find in Current File',
        bindKey: {
            win: 'Ctrl-F',
            mac: 'Command-F',
            sender: "editor"
        },
        exec: function(env, args, request) {
            var ace = editor.current().editor;
            var text = ace.getSession().doc.getTextRange(ace.getSelectionRange());
            setVisible(bottomPane, true);
            findBar.initFind(text);
        }
    })

    editor = {
        _current: aceWidget,
        
        current: function() {
            return this._current;
        }
    };
        
    editor.modeForDocType = function(docType) {
        var mode;
        switch(docType) {
            case "js":
                mode = new JavaScriptMode();
                break;
            case "css":
                mode = new CssMode();
                break;
            case "html":
                mode = new HtmlMode();
                break;
            default:
                mode = new TextMode();
        }
        return mode;
    };
        
    editor.getSession = function(docType, content) {
        var text = content || "";
        var session = new EditSession(text);
        session.setMode(this.modeForDocType(docType));
        session.setUndoManager(new UndoManager());
        return session;
    };
        
    editor.getEmptySession = function() {
        return new EditSession("");
    };
    
    global.editor = editor;
    return editor;
});
