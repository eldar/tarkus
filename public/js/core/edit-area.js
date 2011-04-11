var deps = [
    "jquery",
    "ui-misc/splitter",
    "ace/editor",
    "ace/virtual_renderer",
    "ace/mode/javascript",
    "ace/theme/twilight"
];


define(deps, function($) {
    var Editor = require("ace/editor").Editor;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var theme = require("ace/theme/twilight");

    $("#mainsplit").splitter({
        splitVertical: false,
        sizeLeft: true,
    });
    
//  factor this bit of code into separate unit when implementing layout manager
    var newSplit = $("<div id=\"newsplit\" class=\"splitarea\"> <div class=\"splitterpane\"> <div id=\"editor\">some text</div> </div> <div class=\"splitterpane\">second</div> </div>");
    $("#rightpane").empty().append(newSplit);
    $("#newsplit").splitter({splitVertical : false});
    
    var container = document.getElementById("editor");
    var editor = new Editor(new Renderer(container, theme));
});