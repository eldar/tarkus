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
        
        var openDocsWidget = $("#open-docs-widget");
        openDocsWidget.listWidget()
            .bind("listView.selectNode", function(sender, node) {
                inSelectEvent = true;
                openDocs.setCurrentDocumentById($(node).attr("id"))
                inSelectEvent = false;
            });

        openDocs.bind("change", function(sender, obj) {
            var node = obj.node;
            switch(obj.command) {
                case "add" :
                    openDocsWidget.listWidget("createNode", "first", {
                        "data" : {
                            "title" : node.node.name
                        },
                        "attr" : {
                            "id" : node.id
                        }
                    }, function(elem) {
                        elem.hover(function() {
                            var a = $("<a />").attr("href", "#").addClass("tarkus-button-close").html("✕");
                            $(this).append(a);
                            a.click(function() {
                                openDocs.closeDocument(elem.attr("id"));
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
        .bind("documentClosed", function(id) {
            openDocsWidget.find("#" + id).remove();
        })
        .bind("documentSelectedForView", function(id) {
            if(!inSelectEvent) {
                openDocsWidget.listWidget("selectNode", openDocsWidget.find("#" + id));
            }
        });
    }
};    

});
