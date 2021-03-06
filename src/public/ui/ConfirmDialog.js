define([
    "dojo",
    "dijit/form/CheckBox",
    "sumo/core/ModelBase",
    "util/sprintf",
    "sumo/ui/SimpleDialog",
    "ui/List"
], function(dojo, CheckBox, Model, str, SimpleDialog, List) {
    var Single = dojo.declare(SimpleDialog, {
        title: "Save Changes",

        buttons: ["Save", "Do not Save", "Cancel"],
        
        onButtonClick: function(index) {
            this.hide();
            if(index < 2)
                this._result(index == 0);
        },
        
        promptClose: function(name, result) {
            this.contentNode.innerHTML = str.sprintf("File <i>%s</i> has unsaved changes.", name);
            this.show();
            this._result = result;
        }
    });
    
    var CheckableNode = dojo.declare(dijit._TreeNode, {
        postCreate: function() {
            this.checkBox = new dijit.form.CheckBox({ checked: true });
            this.checkBox.placeAt(this.expandoNode, "after")
        }
    });

    var CheckedTree = dojo.declare(List, {
	    _createTreeNode: function(args) {
		    return new CheckableNode(args);
	    }
    });
    
    var Multi = dojo.declare(SimpleDialog, {
        buildRendering: function() {
            this.inherited(arguments);
            dojo.style(this.contentNode, {
                height: "170px"
            });
            var text = dojo.create("div", {innerHTML: "The following files have unsaved changes"});
            dojo.place(text, this.contentNode);
            dojo.place(dojo.create("p"), this.contentNode);
            this.listData = new Model.ListModel();
            this.tree = new CheckedTree({
                model: this.listData
            });
            this.tree.placeAt(this.contentNode);
        },
        
        title: "Save Changes",

        buttons: ["Save selected", "Close without saving", "Cancel"],
        
        onButtonClick: function(index) {
            this.hide();
            if(index < 2) {
                var save = (index == 0);
                var items = this.listData.root().children;
                var tree = this.tree;
                var forSave = [];
                _.each(items, function(item) {
                    forSave.push(tree.getNodesByItem(item)[0].checkBox.checked);
                });
                this._result(save, forSave);
            }
        },
        
        promptClose: function(names, result) {
            this.listData.setData(names);
            this.show();
            this._result = result;
        }
    });
    
    return {
        Single: Single,
        Multi: Multi
    };
});
