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
    "ide/core/MainArea",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "ui/TemplatedWidget",
    "text!ide/find/QuickFind.html",
    "dijit/form/TextBox",
    "ui/ToolButton"
], function(dojo, canon, event, editor, renderer,
    theme, editSession, jsMode, cssMode, htmlMode, textMode, undoManager, global, mainArea,
    BorderContainer, ContentPane, TemplatedWidget, QuickSearchTemplate) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;
    var EditSession = editSession.EditSession;

    var JavaScriptMode = jsMode.Mode;
    var CssMode = cssMode.Mode;
    var HtmlMode = htmlMode.Mode;
    var TextMode = textMode.Mode;
    var UndoManager = undoManager.UndoManager;

    var bc = new BorderContainer({id: "editorLayout", design: "headline", gutters: false, style: "border: 0px; height: 100%; " });
    dojo.body().appendChild(bc.domNode);
    bc.placeAt(mainArea.center.domNode);
    
    bc.placeAt(mainArea.center.domNode);

    var centerPane = new ContentPane({id: "centerEditor", region: "center", style:"padding: 0px;"});
    bc.addChild(centerPane);
    
    var bottomPane = new ContentPane({id: "bottomEditor", region: "bottom", splitter: false, style:"padding: 0px;"});
    bc.addChild(bottomPane);
    
    var findBar = new TemplatedWidget({ templateString: QuickSearchTemplate });
    findBar.placeAt(bottomPane.domNode);

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
            var value = visible ? "block" : "none";
            dojo.style(bc.domNode, { display: value});
            bc.resize();
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

    var editor = {
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
