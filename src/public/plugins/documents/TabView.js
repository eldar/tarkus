define([
    "dojo",
    "dijit/layout/TabController"
], function(dojo, TabController) {

    var ide = require("core/Ide");

    return dojo.declare(TabController, {
        
        postCreate: function() {
            this._docToButton = {};
            this.inherited(arguments);
            this.connect(this.model, "rowInserted", "onInsertRow");
            this.connect(this.model, "rowRemoved", "onRemoveRow");
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
            
            button.__tarkus_document = item;
            this._docToButton[item.id] = button;
            
			dijit.setWaiState(button.focusNode, "selected", "false");
			var self = this;
			this.connect(button, 'onMouseDown', function() {
                self.model.setCurrentDocument(button.__tarkus_document);
        	    self.selectButton(button);
			});
            
            var confirmDialog = ide.query("documents.confirmDialog");

            this.connect(button, 'onClickCloseButton', function() {
                confirmDialog.closeWithPrompt(button.__tarkus_document);
            });
            
            this.connect(this.model, "currentDocChangedForView", function(doc) {
                if(doc)
        	        self.selectButton(self._docToButton[doc.id]);
            });
			this.addChild(button, row);
            this.sizeChanged();
        },
        
        sizeChanged: function() {
        },
        
		selectButton: function(button) {
            if(this._currentButton === button)
                return;
                
			if(this._currentButton) {
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
        
		onRemoveRow: function(doc) {
			// disconnect connections related to page being removed
//			dojo.forEach(this.pane2connects[page.id], dojo.hitch(this, "disconnect"));
//			delete this.pane2connects[page.id];

			var button = this._docToButton[doc.id];
			if(button) {
				this.removeChild(button);
				delete this._docToButton[doc.id];
				button.destroy();
                this._currentButton = null;
			}
		},
    });
});
