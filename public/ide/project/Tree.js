define([
    "dojo",
    "ui/FixedTreeNode",
    "ui/ResizableTextBox",
    "ide/core/MainArea",
    "ide/core/Actions",
    "ide/core/OpenDocs",
    "ide/project/Nodes",
    "ide/project/Model",
    "dijit/Tree",
    "dijit/tree/_dndSelector",
    "dijit/Menu"
], function(dojo, FixedTreeNode, ResizableTextBox, mainArea, actions, openDocs, nodes, model, Tree, _dndSelector, Menu) {

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
    
    var TreeEditBox = dojo.declare(ResizableTextBox, {
        postCreate: function() {
            this.inherited(arguments);
            dojo.connect(this, "onKeyPress", this, "onKeyPressHandler");
            dojo.connect(this, "onBlur", this, "onBlurHandler");
        },
        
        onKeyPressHandler: function(e) {
            this.inherited(arguments);
            if(e.charOrCode == dojo.keys.ENTER) {
                this._scheduleFinish();
            }
        },
        
        onBlurHandler: function(e) {
            this.inherited(arguments);
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

    var ProjectNode = dojo.declare(FixedTreeNode, {
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
            if(!this.tree._supressEvents) {
                this.tree._onClick(this, e);
            }
        },

        _onDblClick: function(evt) {
            if(!this.tree._supressEvents) {
                this.tree._onDblClick(this, evt);
            }
        },
        
        createEditBox: function() {
            this.tree._supressEvents = true;
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
            this.textBox.startup();
            this.textBox.focus();
        },
        
        onEditingFinished: function() {
            if(!this.textBox)
                return;
            var newValue = this.textBox.attr("value");
            this.textBox.destroy();
            dojo.style(this.labelNode, { display: "inline"});
            this.tree._supressEvents = false;
        }        
    });

    dojo.declare("tarkus._dndSelector", _dndSelector, {
        onMouseDown: function(e) {
            if(!this.tree._supressEvents)
                this.inherited(arguments);
        }
    });
    
    var Type = nodes.Type;
    
    var tree = new Tree({
        model: model,
        autoExpand: false,
        showRoot: false,
        persist: false,
        
        dndController: "tarkus._dndSelector",
        
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

