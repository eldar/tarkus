var deps = [
    "jquery",
    "ui-misc/splitter"
];

require(deps, function($) {
    $("#mainsplit").splitter({
        splitVertical: false,
        sizeLeft: true,
    });
    
    var newSplit = $("<div id=\"newsplit\" class=\"splitarea\"> <div>first</div> <div>second</div> </div>");
    $("#rightpane").empty().append(newSplit);
    $("#newsplit").splitter({splitVertical : false});
});