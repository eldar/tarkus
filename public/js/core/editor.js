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
    "ace/undomanager",
    "core/global"
];
    

define(deps, function(canon, event, editor, renderer,
    theme, editSession, jsMode, cssMode, textMode, undoManager, global) {

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
        global.editorResize = function() {
            env.editor.resize();
        };

        env.modeForDocType = function(docType) {
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
        
        env.setEditorVisible = function(visible) {
            $("#editor").toggle(visible);
        };
        
        env.setEditorVisible(false);
        
        env.getSession = function(docType, content) {
            var text = content || "";
            var session = new EditSession(text);
            session.setMode(env.modeForDocType(docType));
            session.setUndoManager(new UndoManager());
            return session;
        };
        
        env.getEmptySession = function() {
            return new EditSession("");
        };
    }
};

});
