define([
   "dojo",
   "dojo/parser",
   "dijit",
   "text!templates/ide-body.html",
   "dijit/layout/BorderContainer",
   "dijit/layout/ContentPane",
   "dijit/MenuBar",
   "dijit/PopupMenuBarItem",
   "dijit/ToolbarSeparator",
   "dijit/form/Button"
], function (dojo, parser, dijit, bodyView) {
    dojo.html.set(dojo.body(), bodyView);
    parser.parse();

    var mainArea = {
        container: dijit.byId("mainLayout"),
        left: {
           top: dijit.byId("leftTopPane"),
           bottom: dijit.byId("leftBottomPane")
        },
        center: dijit.byId("centerPane")
    };
    
    var ide = require("core/Ide");
    ide.register("mainArea", mainArea);
    return mainArea;
});

