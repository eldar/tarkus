var deps = [
    "jquery",
    "ui-misc/jstree"
];

define(deps, function($) {
    var global = require("core/global");
    
    $("#project-tree-widget").jstree({
            "core" : {
                animation : 200
            },
            "json_data" : {
                "data" : [
                    { 
                        "data" : "New project", 
                        "attr" : { "id" : "root.id" }
                    }
                ]
            },
            "themes" : {
                "theme" : "classic",
                "url"   : "css/jstree-themes/classic/style.css"
            },
            "plugins" : [ "themes", "json_data", "ui" ]
        });

    $( "#new-file" ).click(function() {
        $("#project-tree-widget").jstree("create_node", $("#root\\.id"), "inside", { "data" : "new file" }, true);

    });

    var x = 5;
});