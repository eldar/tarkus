var deps = [
   "dojo",
   "dojo/parser",
   "dijit",
   "text!templates/ide-body.html",
   "dijit/layout/BorderContainer",
   "dijit/layout/ContentPane",
   "dijit/MenuBar",
   "dijit/PopupMenuBarItem"
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

// Here's how you create Border layout programmatically
/*
    var bc = new BorderContainer({id: "mainLayout", design: "headline", style: "border: 0px; height: 100%; " });
    dojo.body().appendChild(bc.domNode);

    var leftPane = new ContentPane({id: "left", region: "left", style:"padding: 0px; width: 200px", splitter: true});
    leftPane.attr('content', 'LeftPane');
    bc.addChild(leftPane);

    var topPane = new ContentPane({id: "top", region: "top", style:"padding: 0px; height: 28px"});
    bc.addChild(topPane);

    var centerPane = new ContentPane({id: "center", region: "center", style:"padding: 0px;"});
    bc.addChild(centerPane);

    bc.startup();
    bc.layout();
*/
