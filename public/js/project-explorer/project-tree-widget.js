var deps = [
    "jquery",
    "ui-misc/jstree"
];

require(deps, function($) {
    $(".projecttreewidget")
        .jstree({
            "core" : {
                animation : 300
            },
            "json_data" : {
                "data" : [
                    { 
                        "data" : "A node", 
                        "children" : [ "Child 1", "Child 2" ]
                    },
                    { 
                        "attr" : { "id" : "li.node.id" }, 
                        "data" : { 
                            "title" : "Long format demo", 
                            "attr" : { "href" : "#" } 
                        } 
                    }
                ]
            },
            "themes" : {
                "theme" : "classic"
            },
            "plugins" : [ "themes", "json_data" ]
        });
});