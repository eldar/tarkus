define([
    "dojo",
    "sumo",
    "sumo/ui/TemplatedWidget",
    "text!ui/FindBar.html",
    "dijit/form/TextBox",
    "sumo/ui/ToolButton"
], function(dojo, sumo, TemplatedWidget, FindBarTemplate) {

    return dojo.declare(TemplatedWidget, {
        templateString: FindBarTemplate,
        
        postCreate: function() {
            this.connect(this.findTextBox, "onKeyPress", "onFindKeyPressHandler");
            this._findText = "";
        },
        
        // Overridable functions
        
        closePane: function() {},
        findNext: function() {},
        findPrevious: function() {},
        doFind: function(text) {},
        
        onFindKeyPressHandler: function(e) {
            switch(e.charOrCode) {
                case dojo.keys.ENTER:
                    this._findNext();
                    break;
                case dojo.keys.ESCAPE:
                    this.closePane();
                    break;
            };
        },
        
        initFind: function(text) {
            this.findTextBox.focus();
            if(text)
                this.findTextBox.set("value", text);
            this.findTextBox.focusNode.select();
        },

        find: function() {
            this._findText = this.findTextBox.get("value");
            this.doFind(this._findText);
        },

        _findNext: function() {
            if(this._findText !== this.findTextBox.get("value")) {
                this.find();
            } else {
                this.findNext();
            }
        },
        
        _findPrevious: function() {
            this.findPrevious()
        }
    });
});
