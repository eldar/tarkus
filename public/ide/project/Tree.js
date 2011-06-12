define([
    "dojo",
    "ui/FixedTreeNode",
    "ide/core/MainArea",
    "ide/core/Actions",
    "ide/core/OpenDocs",
    "ide/project/Nodes",
    "ide/project/Model",
    "dijit/Tree",
    "dijit/Menu",
    "dijit/form/TextBox"
], function(dojo, FixedTreeNode, mainArea, actions, openDocs, nodes, model, Tree, Menu, TextBox) {

    var selectedItem = null;

    var pMenu = new Menu();
    pMenu.addChild(new dijit.MenuItem({
        label: "Rename",
        onClick: function() {
            selectedItem.createEditBox();
        }
    }));
    pMenu.addChild(new dijit.MenuItem({
        label: "Delete",
    }));
    pMenu.startup();

    var TreeEditBox = dojo.declare(TextBox, {

        postCreate: function() {
            this.inherited(arguments);
            dojo.connect(this, "onKeyPress", this, "onKeyPressHandler");
            dojo.connect(this, "onBlur", this, "onBlurHandler");
        },
        
        onKeyPressHandler: function(e) {
            if(e.charOrCode == dojo.keys.ENTER) {
//                console.log("enter pressed");
                this._scheduleFinish();
            }
        },
        
        onBlurHandler: function(e) {
//            console.log("onblur event");
            this._scheduleFinish();
        },
        
        _scheduleFinish: function() {
		    if(!this._finishTimer) {
			    this._finishTimer = setTimeout(dojo.hitch(this, function() {
				    delete this._finishTimer;
				    this.treeItem.onEditingFinished();
			    }), 1);
		    }
        }
    });

    var ProjectNode = dojo.declare([dijit._TreeNode, FixedTreeNode], {
    
        constructor: function() {
            this.supressEvents = false;
        },
    
        postCreate: function() {
            dojo.connect(this.rowNode, "oncontextmenu", dojo.hitch(this, "onContextMenu"));
        },
        
        onContextMenu: function(e) {
            selectedItem = this;
            this.tree.set("path", this.item.fullObjectPath());
            pMenu._scheduleOpen(e.target, undefined, {x: e.pageX, y: e.pageY});
            dojo.stopEvent(e);
        },
        
        _onClick: function(e) {
//            console.log("TreeNode._onClick");
            if(!this.supressEvents) {
//                console.log("TreeNode.handling further");
                this.tree._onClick(this, e);
            }
        },

        _onDblClick: function(evt) {
            if(!this.supressEvents) {
                this.tree._onDblClick(this, evt);
            }
        },
        
        createEditBox: function() {
            this.supressEvents = true;
            var width = this.labelNode.style.width;
            dojo.style(this.labelNode, { display: "none"});

            var self = this;
            this.textBox = new TreeEditBox({
                treeItem: self,
                name: "editName",
                value: this.tree.model.getLabel(this.item),
                style: {
                    width: "100px",
                    marginLeft: "4px",
                    marginRight: "4px"
                }
            });
            this.textBox.placeAt(this.labelNode, "before");
            this.textBox.focus();
        },
        
        onEditingFinished: function() {
            if(!this.textBox)
                return;
            var newValue = this.textBox.attr("value");
            this.textBox.destroy();
            dojo.style(this.labelNode, { display: "inline"});
            this.supressEvents = false;
        }        
    });

    var Type = nodes.Type;
    
    var tree = new Tree({
        model: model,
        autoExpand: false,
        showRoot: false,
        persist: false,
        
        _createTreeNode: function(args) {
            return new ProjectNode(args);
        },
        
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
        },
        
        _onKeyPress: function(e) {
        }
    });
    tree.placeAt(mainArea.left.top.domNode);
    return tree;
});

