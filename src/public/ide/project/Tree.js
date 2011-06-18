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
    "dijit/Menu"
], function(dojo, FixedTreeNode, ResizableTextBox, mainArea, actions, openDocs, nodes, model, Tree, Menu) {

    var Type = nodes.Type;

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
        onClick: function() {
            var node = selectedItem.item;
            if(node.type !== Type.Project)
                model.deleteNode(node);
        }
    }));
    pMenu.startup();
    
    var TreeEditBox = dojo.declare(ResizableTextBox, {
        postCreate: function() {
            this.inherited(arguments);
            dojo.forEach(["onmousedown", "onmouseup", "onclick", "onkeypress"], function(name){ 
                this.connect(this.domNode, name, function(evt) { 
                    evt.stopPropagation(); 
                });
            }, this);
            this.connect(this, "onKeyPress", "onKeyPressHandler");
            this.connect(this, "onBlur", "onBlurHandler");
            //this.watch("value", function (propName, oldValue, newValue) { ... })
        },
        
        onKeyPressHandler: function(e) {
            this.inherited(arguments);
            var result = 0;
            switch(e.charOrCode) {
                case dojo.keys.ENTER:
                    result = 2; break;
                case dojo.keys.ESCAPE:
                    result = 1; break;
            };
            if(result > 0)
                this._scheduleFinish(result > 1);
        },
        
        onBlurHandler: function(e) {
            this.inherited(arguments);
            this._scheduleFinish(true);
        },
        
        _scheduleFinish: function(success) {
		    if(!this._finishTimer) {
			    this._finishTimer = setTimeout(dojo.hitch(this, function() {
				    delete this._finishTimer;
				    this.treeItem.onEditingFinished(success);
			    }), 0);
		    }
        }
    });

    var ProjectNode = dojo.declare(FixedTreeNode, {
        postCreate: function() {
            dojo.connect(this.rowNode, "oncontextmenu", dojo.hitch(this, "onContextMenu"));
        },
        
        onContextMenu: function(e) {
            selectedItem = this;
            this.tree.set("path", this.item.fullObjectPath());
            pMenu._scheduleOpen(e.target, undefined, {x: e.pageX, y: e.pageY});
            dojo.stopEvent(e);
        },
        
        _onDblClick: function(evt) {
            if(!this._supressEvents) {
                this.tree._onDblClick(this, evt);
            }
        },

        createEditBox: function() {
            this._supressEvents = true;
            dojo.style(this.labelNode, { display: "none"});

            var self = this;
            this.textBox = new TreeEditBox({
                treeItem: self,
                name: "editName",
                value: this.tree.model.getLabel(this.item),
                style: { //FIXME remove styling into css
                    marginLeft: "4px",
                    marginRight: "4px"
                }
            });
            this.textBox.placeAt(this.labelNode, "before");
            this.textBox.startup();
            this.textBox.focus();
        },
        
        onEditingFinished: function(success) {
            if(!this.textBox)
                return;
            var newValue = this.textBox.attr("value");
            this.textBox.destroy();
            var oldValue = this.tree.model.getLabel(this.item);
            if(success && (oldValue !== newValue)) {
                this.tree.model.setLabel(this.item, newValue);
            }
            dojo.style(this.labelNode, { display: "inline"});
            delete this._supressEvents;
        }        
    });

    var ProjectTree = dojo.declare(Tree, {
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
        
        selectedDataNode: function() {
            var path = tree.get("path");
            if(path.length === 0)
                return null;
            return _.last(path);
        }
    });
    var tree = new ProjectTree();
    tree.placeAt(mainArea.left.top.domNode);
    mainArea.left.top.resize(); // otherwise the tree scrollbars doesn't appear until next resize
    return tree;
});

