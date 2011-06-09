define([
    "dojo",
    "ide/core/MainArea",
    "ide/core/Actions",
    "ide/core/OpenDocs",
    "ide/project/Nodes",
    "ide/project/Model",
    "dijit/Tree"
], function(dojo, mainArea, actions, openDocs, nodes, model, Tree) {

    var Type = nodes.Type;
    
    var tree = new Tree({
        model: model,
        autoExpand: false,
        showRoot: false,
        persist: false,
        
        getIconClass: function(node, opened) {
            if(node.type === Type.File)
                return "";
            return ((!node || this.model.mayHaveChildren(node))) && opened ? "dijitFolderOpened" : "dijitFolderClosed";
        },
      
        getIconStyle: function(node) {
            if(node.type !== Type.File)
                return {};
            return {
                backgroundImage: "url('" + this.getIconUrl(node) + "')",
                'height': '16px',
                'width': '16px'
            };
        },

        getIconUrl: function(node) {
            var icon;
            switch(node.docType) {
                case "js":
                    icon = "icons/images/js.png"; break;
                case "css":
                    icon = "icons/images/css.png"; break;
                case "html":
                    icon = "icons/images/html.png"; break;
                default:
                    icon = "icons/images/unknown.png"; break;
            }
            return icon;
        },
        
        onDblClick: function(node) {
            model.openAndSelectDocument(node);
        },
        
        onClick: function(node) {
            var action = actions.file.closeProject;
            action.set("label", 'Close Project "' + node.getProject().name + '"');
            action.set("disabled", false);
            model.updateCurrentProject(node);
        }
    });
    tree.placeAt(mainArea.left.top.domNode);
    return tree;
});

