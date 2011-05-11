var deps = [
    "jquery",
    "project-explorer/model"    
];

define(deps, function($, manager) {

return {

    init: function() {
    
        var inSelectEvent = false;
        
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
                        },
                        "folder" : {}
                    }
                },
                "sort" : function (a, b) {
                    var typeA = this._get_type(a);
                    var typeB = this._get_type(b);
                    var dirType = "folder";
                    if(typeA == dirType && typeB != dirType)
                        return -1;
                    else if(typeA != dirType && typeB == dirType)
                        return 1;
                    else
                        return this.get_text(a) > this.get_text(b) ? 1 : -1;
                },
                "plugins" : [ "themes", "json_data", "ui", "types", "sort", "crrm" ]
            })
            // hanling selection of the node in jstree
            .bind("select_node.jstree", function(e, obj) {
                var domElem = obj.rslt.obj;
                var id = domElem.attr("id");
                inSelectEvent = true;
                manager.setCurrentNode(id);
                inSelectEvent = false;
            })
            .bind("rename.jstree", function(e, data) {
                var rslt = data.rslt;
                var tree = data.inst;
                var id = rslt.obj.attr("id");
                if(manager.renameNode(id, rslt.new_name)) {
                    tree.set_type(manager.getNodeById(id).docType, rslt.obj);
                }
                else {
                    tree.set_text(rslt.obj, rslt.old_name);
                }
            });

        // Handler of the changes of the Project Model, that defines how jstree reacts to those changes
        manager.bind("change", function(sender, obj) {
            var node = obj.node;
            var tree = $("#project-tree-widget");
            switch(obj.command) {
                case "add" :
                    var isToplevel = (node.parent.parent == null);
                    var parent = isToplevel ? -1 : node.parent.getDom();
                    var position = isToplevel ? "last" : "inside";
                    tree.jstree("create_node", parent, position, {
                        "data" : {
                            "title" : obj.node.name
                        },
                        "attr" : {
                            "id" : node.id,
                            "rel" : node.docType
                        }
                    });
                    // FIXME jstree bug http://code.google.com/p/jstree/issues/detail?id=954
                    // we shouln't need to call deselect_all
                    manager.setCurrentNode(node.id);
                    if(parent != -1 && !tree.jstree("is_open", parent))
                        tree.jstree("open_node", parent);
                    break;
                default:
                    alert("project model: no action taken");
            }
        })
        .bind("currentNodeChanged", function(node) {
            if(!inSelectEvent) {
                tree = $("#project-tree-widget");
                tree.jstree("deselect_all");
                tree.jstree("select_node", node.getDom());
            }
        })
        .bind("trigger_rename", function(node) {
            $("#project-tree-widget").jstree("rename", node.getDom());
        })
        .bind("trigger_remove", function(node) {
            $("#project-tree-widget").jstree("remove", node.getDom());
        });
    }
};    

});
