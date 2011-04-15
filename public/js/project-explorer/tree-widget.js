var deps = [
    "jquery",
    "ui-misc/jstree"
];

define(deps, function($) {
    var global = require("core/global");
    
    var manager = global.projectManager;
    
    $("#project-tree-widget").jstree({
            "core" : {
                "animation" : 200
            },
            "json_data" : {
                "data" : []
            },
            "themes" : {
                "theme" : "classic",
                "url"   : "css/jstree-themes/classic/style.css"
            },
            "ui" : {
                "select_limit" : 1
            },
            "plugins" : [ "themes", "json_data", "ui" ]
        })

        .bind("select_node.jstree", function(e, obj) {
            var domElem = obj.rslt.obj;
            var id = domElem.attr("id");
            manager.setCurrentNode(id);
        });

    $( "#new-file" ).click(function() {
        $("#project-tree-widget").jstree("create_node", $("#root\\.id"), "inside", { "data" : "new file" }, true);
    });
    
    manager.bind("change", function(sender, obj) {
        var node = obj.node;
        switch(obj.command) {
            case "add" :
                /*
                $("#project-tree-widget").jstree("create_node", $("#root\\.id"), "inside", { "data" : obj.node.name }, true);*/
                var parent = (node.parent.name == "root-node") ? -1 : $("#" + node.parent.id);
                $("#project-tree-widget").jstree("create_node", -1, "last", {
                    "data" : obj.node.name,
                    "attr"  : { "id" : node.id }
                }); 
                break;
            default:
                alert("project model: no action taken");
        }
    })
});