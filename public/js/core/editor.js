var deps = [
    "pilot/canon",
    "pilot/event",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/theme/textmate",
    "ace/edit_session",
    "ace/mode/javascript",
    "ace/mode/css",
    "ace/mode/text",
    "ace/undomanager"
    
];
    

define(deps, function(canon, event, editor, renderer,
    theme, editSession, jsMode, cssMode, textMode, undoManager) {

return {
    init : function(env) {

        var Editor = editor.Editor;
        var Renderer = renderer.VirtualRenderer;
        var EditSession = editSession.EditSession;

        var JavaScriptMode = jsMode.Mode;
        var CssMode = cssMode.Mode;
        var TextMode = textMode.Mode;
        var UndoManager = undoManager.UndoManager;

        var session = new EditSession("");
        session.setMode(new JavaScriptMode());
        session.setUndoManager(new UndoManager());
        
        var container = document.getElementById("editor");
        env.editor = new Editor(new Renderer(container, theme));

        env.editor.resize();

        env.getSession = function(docType) {
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
            var session = new EditSession("");
            session.setMode(mode);
            session.setUndoManager(new UndoManager());
            return session;
        }
    }
};

});
