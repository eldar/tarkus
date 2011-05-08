var deps = [
    "jquery",
    "core/opened-docs",
    "ui-misc/list-widget"
];

define(deps, function($, openedDocs, listWid) {

return {

    init: function() {
        listWid.init();
        $("#opened-docs-widget").listWidget();

        // Handler of the changes of the Project Model, that defines how jstree reacts to those changes
        openedDocs.bind("change", function(sender, obj) {
            var node = obj.node;
            var tree = $("#opened-docs-widget");
            switch(obj.command) {
                case "add" :
                    tree.listWidget("createNode", {
                        "data" : {
                            "title" : node.node.name
                        },
                        "attr" : {
                            "id" : node.node.id
                        }
                    }, function(elem) {
                        elem.hover(function() {
                            $(this).append("<a class=\"tarkus-button-close\" href=\"#\">✕&nbsp;</a>"); //✖
                        }, function() {
                            $("#opened-docs-widget #" + node.node.id + " .tarkus-button-close").remove();
                        });
                    });
                    break;
                default:
                    alert("project model: no action taken");
            }
        });
/*
        $("#opened-docs-widget").jstree({
                "core" : {
                    "animation" : 0
                },
                "json_data" : {
                    "data" : []
                },
                "ui" : {
                    "select_limit" : 1
                },
                "sort" : function (a, b) {
                    return this.get_text(a) > this.get_text(b) ? 1 : -1;
                },
                "plugins" : [ "themes", "json_data", "ui", "sort" ]
            })
            // hanling selection of the node in jstree
            .bind("select_node.jstree", function(e, obj) {
                var domElem = obj.rslt.obj;
                var id = domElem.attr("id");
                manager.setCurrentNode(id);
            });

        // Handler of the changes of the Project Model, that defines how jstree reacts to those changes
        openedDocs.bind("change", function(sender, obj) {
            var node = obj.node;
            var tree = $("#opened-docs-widget");
            switch(obj.command) {
                case "add" :
                    tree.jstree("create_node", -1, "last", {
                        "data" : {
                            "title" : node.node.name
                        },
                        "attr" : {
                            "id" : node.node.id
                        }
                    }, function() {
                        $("#opened-docs-widget #" + node.node.id)
                            .removeClass("jstree-leaf jstree-last")
                            .hover(function() {
                                $(this)
                                    .addClass("tarkus-ui-hovered")
                                    .append("<a class=\"tarkus-button-close\" href=\"#\">x</a>");
                            }, function() {
                                $(this).removeClass("tarkus-ui-hovered")
                                $("#opened-docs-widget #" + node.node.id + " .tarkus-button-close").remove();
                            });
                    });
                    break;
                default:
                    alert("project model: no action taken");
            }
        });
        
        */
    }
};    

});
