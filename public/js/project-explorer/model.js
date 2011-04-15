var deps = [
    "jquery"
];

define(deps, function($) {
    var global = require("core/global");
    var Node = require("project-explorer/nodes").Node;

    var ProjectModel = Backbone.Model.extend({
        self : {},
        
        initialize : function() {
            this.self = new Node("root-node", null);
        },

        newElement : function(name) {
            self.addChild(new Node(name, self));
        }
    });

    global.projectManager = new ProjectModel;
});
