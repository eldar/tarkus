var deps = [
    "jquery",
    "core/opened-docs",
    "ui-misc/list-widget"
];

define(deps, function($, openedDocs, listWid) {

return {

    init: function() {
        listWid.init();
        
        var inSelectEvent = false;
        
        $("#opened-docs-widget").listWidget()
            .bind("listView.selectNode", function(sender, node) {
                inSelectEvent = true;
                openedDocs.setCurrentDocumentById($(node).attr("id"))
                inSelectEvent = false;
            });

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
        })
        .bind("documentSelectedForView", function(id) {
            if(!inSelectEvent) {
                list = $("#opened-docs-widget");
                list.listWidget("selectNode", list.find("#" + id));
            }
        });
    }
};    

});
