var deps = [
    "jquery",
    "core/open-docs",
    "ui-misc/list-widget"
];

define(deps, function($, openDocs, listWid) {

return {

    init: function() {
        listWid.init();
        
        var inSelectEvent = false;
        
        $("#open-docs-widget").listWidget()
            .bind("listView.selectNode", function(sender, node) {
                inSelectEvent = true;
                openDocs.setCurrentDocumentById($(node).attr("id"))
                inSelectEvent = false;
            });

        // Handler of the changes of the Project Model, that defines how jstree reacts to those changes
        openDocs.bind("change", function(sender, obj) {
            var node = obj.node;
            var tree = $("#open-docs-widget");
            switch(obj.command) {
                case "add" :
                    tree.listWidget("createNode", "first", {
                        "data" : {
                            "title" : node.node.name
                        },
                        "attr" : {
                            "id" : node.node.id
                        }
                    }, function(elem) {
                        elem.hover(function() {
                            var a = $("<a />").attr("href", "#").addClass("tarkus-button-close").html("✕");
                            $(this).append(a);
                            a.click(function() {
                                openDocs.closeDocument(elem.attr("id"));
                                elem.remove();
                            });
                        }, function() {
                            $(this).find(".tarkus-button-close").remove();
                        });
                    });
                    break;
                default:
                    alert("project model: no action taken");
            }
        })
        .bind("documentSelectedForView", function(id) {
            if(!inSelectEvent) {
                list = $("#open-docs-widget");
                list.listWidget("selectNode", list.find("#" + id));
            }
        });
    }
};    

});
