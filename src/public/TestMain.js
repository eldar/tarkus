define([
    "dojo",
    "sumo",
    "sumo/ui/Splitter",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function (dojo, sumo, Splitter, ContentPane) {
    var splitter = new Splitter({
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
    var cp2 = cp();  
    splitter.addChild(cp2);
    splitter.addChild(cp());

    splitter.startup();
//    sumo.setWidgetVisible(cp2, false);
});
