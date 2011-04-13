var deps = [
    "jquery",
    "ui-misc/splitter"
];

define(deps, function($) {
    $("#mainsplit").splitter({
        splitVertical: false,
        sizeLeft: true,
    });
/*    
//  factor this bit of code into separate unit when implementing layout manager
    var newSplit = $("<div id=\"newsplit\" class=\"splitarea\"> <div class=\"splitterpane\"> <div id=\"editor\"></div> </div> <div class=\"splitterpane\">second</div> </div>");
    $("#rightpane").empty().append(newSplit);
    $("#newsplit").splitter({splitVertical : false});
    */
});
