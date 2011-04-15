var deps = [
    "jquery",
    "ui-misc/jstree"
];

define(deps, function($) {
    var global = require("core/global");
    
    global.projectTreeWidget = $(".projecttreewidget");
    global.projectTreeWidget.jstree({
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
                "theme" : "classic",
                "url"   : "css/jstree-themes/classic/style.css"
            },
            "plugins" : [ "themes", "json_data" ]
        });
});