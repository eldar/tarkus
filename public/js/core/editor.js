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
    var UndoManager = require("ace/undomanager").UndoManager;

    var session = new EditSession("function helloAce() { return \"Hello world\";}");
    session.setMode(new JavaScriptMode());
    session.setUndoManager(new UndoManager());
    
    var container = document.getElementById("editor");
    env.editor = new Editor(new Renderer(container, theme));
    env.editor.setSession(session);

    env.editor.resize();
}
};

});
