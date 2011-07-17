define([
    "dojo",
    "sumo",
    "sumo/ui/Splitter",
    "sumo/ui/Box",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function (dojo, sumo, Splitter, Box, ContentPane) {
    var splitter = new Box({
        orientation: sumo.Vertical,
    }, "main");
    var cp = function() {
        return new ContentPane({
            style: "border: 1px solid green"
        });
    };
/*
    var sp = function() {
        var splitter = new Splitter({
            style: "border: 1px solid blue",
            orientation: sumo.Vertical
        });
        
        splitter.addChild(cp());
        splitter.addChild(cp());
        splitter.addChild(cp());
        splitter.addChild(cp());
        splitter.addChild(cp());
        splitter.addChild(cp());
        return splitter;
    };
*/  
    splitter.addChild(cp());
    var c = cp();
//    var el = dojo.create("div", { style: "border: 1px solid red; height: 20px;" });
//    dojo.place(el, c.domNode);
    splitter.addChild(c);
    splitter.addChild(cp());

    splitter.startup();
//    sumo.setWidgetVisible(cp2, false);
});
