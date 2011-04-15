var deps = [
    "jquery"
];

define(deps, function($) {
    var global = require("core/global");
    var Node = require("project-explorer/nodes").Node;

    var ProjectModel = Backbone.Model.extend({
        self : {},
        currentNode : null,
        
        initialize : function() {
            this.self = new Node("root-node");
        },

        newProject : function(name) {
            var node = new Node(name);
            this.self.addChild(node);
            this.change({
                command : "add",
                node: node
            });
        },

        newFile : function(name) {
            var node = new Node(name);
            this.currentNode.addChild(node);
            this.change({
                command : "add",
                node: node
            });
        },
        
        setCurrentNode : function(id) {
            this.currentNode = this.self.find(function(node) {
                return node.id == id;
            });
        }
    });

    global.projectManager = new ProjectModel;
});
