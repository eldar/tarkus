define([
    "dojo",
    "dijit/layout/TabController"
], function(dojo, TabController) {
    return dojo.declare(TabController, {
        
        postCreate: function() {
            this.inherited(arguments);
            this.connect(this.model, "rowInserted", "onInsertRow");
        },
        
        onInsertRow: function(row, item) {
            var mdl = this.model;
    		var cls = dojo.getObject(this.buttonWidget);
			var button = new cls({
				label: mdl.getLabel(item),
				showLabel: true,
				closeButton: true,
				title: mdl.getToolTip(item),
				dir: "ltr"
			});
			dijit.setWaiState(button.focusNode, "selected", "false");
			var self = this;
			this.connect(button, 'onMouseDown', function() {
			    self.selectButton(button);
			});

			this.addChild(button, row);
            this.sizeChanged();
        },
        
        sizeChanged: function() {
        },
        
		selectButton: function(button){
			if(this._currentButton){
				var oldButton = this._currentButton;
				oldButton.set('checked', false);
				dijit.setWaiState(oldButton.focusNode, "selected", "false");
				oldButton.focusNode.setAttribute("tabIndex", "-1");
			}

			var newButton = button;
			newButton.set('checked', true);
			dijit.setWaiState(newButton.focusNode, "selected", "true");
			this._currentButton = newButton;
			newButton.focusNode.setAttribute("tabIndex", "0");
		},
    });
});
