define([
    "dojo",
    "sumo",
    "ace/edit_session",
    "ace/mode/javascript",
    "ace/mode/css",
    "ace/mode/html",
    "ace/mode/text",
    "ace/undomanager",
    "core/Global",
    "ide/core/MainArea",
    "ide/core/EditorComponent"
], function(dojo, sumo, editSession, jsMode, cssMode, htmlMode, textMode, undoManager,
    global, mainArea, EditorComponent) {

    var EditSession = editSession.EditSession;

    var JavaScriptMode = jsMode.Mode;
    var CssMode = cssMode.Mode;
    var HtmlMode = htmlMode.Mode;
    var TextMode = textMode.Mode;
    var UndoManager = undoManager.UndoManager;

    var editor = {
        _current: null,
        
        current: function() {
            return this._current;
        },
        
        setCurrent: function(newCurrent) {
            this._current = newCurrent;
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
    
    var ideComponent = new EditorComponent().placeAt(mainArea.center.domNode);
    ideComponent.setVisible(false);
    
    editor.setCurrent(ideComponent);

    return editor;
});
