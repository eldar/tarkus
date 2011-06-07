var deps = [
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
];

define(deps, function (dojo, parser, dijit, bodyView) {
    dojo.html.set(dojo.body(), bodyView);
    parser.parse();

    return {
        container: dijit.byId("mainLayout"),
        left: {
           top: dijit.byId("leftTopPane"),
           bottom: dijit.byId("leftBottomPane")
        },
        center: dijit.byId("centerPane")
    };
});

