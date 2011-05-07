var deps = [
    "jquery",
    "core/global"
];

define(deps, function($, global) {
    var OpenedDocuments = Backbone.Model.extend({
        _docs: [],
        
        open: function(docEntry) {
            this._docs.push(docEntry);
            this.change({
                command: "add",
                node: docEntry
            });
        }
    });
    
    return new OpenedDocuments;
});
