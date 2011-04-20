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
            "types" : {
                "types" : {
                    "js" : {
                        "icon" : {
                            "image" : "images/js.png"
                        }
                    },
                    "css" : {
                        "icon" : {
                            "image" : "images/css.png"
                        }
                    },
                    "unknown" : {
                        "icon" : {
                            "image" : "images/unknown.png"
                        }
                    }
                }
            },
            "plugins" : [ "themes", "json_data", "ui", "types" ]
        })
        // hanling selection of the node in jstree
        .bind("select_node.jstree", function(e, obj) {
            var domElem = obj.rslt.obj;
            var id = domElem.attr("id");
            manager.setCurrentNode(id);
        });

    // Handler of the changes of the Project Model, that defines how jstree reacts to those changes
    manager.bind("change", function(sender, obj) {
        var node = obj.node;
        switch(obj.command) {
            case "add" :
                // TODO more robust check for a top-level node
                var isToplevel = (node.parent.name == "root-node");
                var parent = isToplevel ? -1 : $("#" + node.parent.id);
                var position = isToplevel ? "last" : "inside";
                var tree = $("#project-tree-widget");
                var elemType = node.isFolder() ? "default" : node.docType;
                tree.jstree("create_node", parent, position, {
                    "data" : {
                        "title" : obj.node.name
                    },
                    "attr" : {
                        "id" : node.id,
                        "rel" : elemType
                    }
                });
                if(parent != -1 && !tree.jstree("is_open", parent))
                    tree.jstree("open_node", parent);
                break;
            default:
                alert("project model: no action taken");
        }
    })
});
