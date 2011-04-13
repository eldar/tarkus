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
    
    /* 
    function onResize() {
        container.style.width = (document.documentElement.clientWidth) + "px";
        container.style.height = (document.documentElement.clientHeight - 60 - 22) + "px";
        env.editor.resize();
    };

    window.onresize = onResize;
    onResize();
    */

}
};

});
