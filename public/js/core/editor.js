define(function(require) {

return {
launch : function(env) {
    var canon = require("pilot/canon");
    var event = require("pilot/event");
    var Editor = require("ace/editor").Editor;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var theme = require("ace/theme/textmate");
    var EditSession = require("ace/edit_session").EditSession;

    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var CssMode = require("ace/mode/css").Mode;
    var TextMode = require("ace/mode/text").Mode;
    var UndoManager = require("ace/undomanager").UndoManager;

    var session = new EditSession("");
    session.setMode(new JavaScriptMode());
    session.setUndoManager(new UndoManager());
    
    var container = document.getElementById("editor");
    env.editor = new Editor(new Renderer(container, theme));

    env.editor.resize();

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
    
    env.getSession = function(docType) {
        var session = new EditSession("");
        session.setMode(env.modeForDocType(docType));
        session.setUndoManager(new UndoManager());
        return session;
    };
}
};

});
