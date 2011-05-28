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
    "core/global",
    "ide/core/MainArea"
];
    

define(deps, function(dojo, canon, event, editor, renderer,
    theme, editSession, jsMode, cssMode, textMode, undoManager, global, mainArea) {

return {
    init : function(env) {

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
        
        env.editor = aceWidget.editor;
        
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
//            $("#editor").toggle(visible);
        };
        
//        env.setEditorVisible(false);
        
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
