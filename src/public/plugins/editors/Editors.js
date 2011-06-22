define([
    "dojo",
    "ace/edit_session",
    "ace/mode/javascript",
    "ace/mode/coffee",
    "ace/mode/css",
    "ace/mode/html",
    "ace/mode/text",
    "ace/undomanager"
], function(dojo, editSession, jsMode, coffeeMode, cssMode, htmlMode, textMode, undoManager) {

    var EditSession = editSession.EditSession;

    var JavaScriptMode = jsMode.Mode;
    var CssMode = cssMode.Mode;
    var HtmlMode = htmlMode.Mode;
    var TextMode = textMode.Mode;
    var UndoManager = undoManager.UndoManager;
    var CoffeeMode = coffeeMode.Mode;

    var Editors = dojo.declare(null, {
        _current: null,
        
        current: function() {
            return this._current;
        },
        
        setCurrent: function(newCurrent) {
            this._current = newCurrent;
        },
        
        modeForDocType: function(docType) {
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
                case "coffee":
                    mode = new CoffeeMode();
                    break;
                default:
                    mode = new TextMode();
            }
            return mode;
        },
       
        getSession: function(docType, content) {
            var text = content || "";
            var session = new EditSession(text);
            session.setMode(this.modeForDocType(docType));
            session.setUndoManager(new UndoManager());
            return session;
        },
        
        getEmptySession: function() {
            return new EditSession("");
        }
    });
    
    return Editors;
});
