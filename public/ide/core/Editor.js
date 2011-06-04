var deps = [
    "dojo",
    "pilot/canon",
    "pilot/event",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ace/edit_session",
    "ace/mode/javascript",
    "ace/mode/css",
    "ace/mode/text",
    "ace/undomanager",
    "core/Global",
    "ide/core/MainArea"
];
    

define(deps, function(dojo, canon, event, editor, renderer,
    theme, editSession, jsMode, cssMode, textMode, undoManager, global, mainArea) {

    var Editor = editor.Editor;
    var Renderer = renderer.VirtualRenderer;
    var EditSession = editSession.EditSession;

    var JavaScriptMode = jsMode.Mode;
    var CssMode = cssMode.Mode;
    var TextMode = textMode.Mode;
    var UndoManager = undoManager.UndoManager;

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
        
    var aceWidget = new AceWidget().placeAt(mainArea.center.domNode);
    dojo.style(aceWidget.domNode, {
        "height": "100%",
        "width": "100%"
    });
    aceWidget.resize();
        
    aceWidget.editor.renderer.setHScrollBarAlwaysVisible(false);

    var editor = {};
        
    editor._editor = aceWidget.editor;
    editor.currentEditor = function() {
        return this._editor;
    };
        
    editor.setEditorVisible = function(visible) {
        var value = visible ? "block" : "none";
        dojo.style(aceWidget.domNode, { display: value});
    };
        
//    editor.setEditorVisible(false);

    editor.modeForDocType = function(docType) {
        var mode;
        switch(docType) {
            case "js":
                mode = new JavaScriptMode();
                break;
            case "css":
                mode = new CssMode();
                break;
            default:
                mode = new TextMode();
        }
        return mode;
    };
        
    editor.getSession = function(docType, content) {
        var text = content || "";
        var session = new EditSession(text);
        session.setMode(env.modeForDocType(docType));
        session.setUndoManager(new UndoManager());
        return session;
    };
        
    editor.getEmptySession = function() {
        return new EditSession("");
    };
    
    return editor;
});
