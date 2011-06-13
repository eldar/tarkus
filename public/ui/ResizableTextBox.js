define([
    "dojo",
    "dijit/form/TextBox"
], function(dojo, TextBox) {

    var getWidth = function(elem) {
        return dojo.position(elem, true).w;
    };

    // Text box automatically resizes to its content, ported from jQuery plugin described here
    // http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields/931695#931695
    var ResizableTextBox = dojo.declare(TextBox, {
        intermediateChanges: true,
        
        comfortZone: 15,
        minWidth: 50,
        maxWidth: 500,
        
        startup: function() {
            console.log("Resizable startup");
            this.inherited(arguments);
            var input = this.domNode;
            this.testSubject = dojo.create("div", {
                style: {
                    position: 'absolute',
                    top: "-9999px",
                    left: "-9999px",
                    width: 'auto',
                    fontSize: dojo.style(input, 'fontSize'),
                    fontFamily: dojo.style(input, 'fontFamily'),
                    fontWeight: dojo.style(input, 'fontWeight'),
                    letterSpacing: dojo.style(input, 'letterSpacing'),
                    whiteSpace: 'nowrap'
                }
            });
            dojo.connect(this, "onChange", this, "updateSize");
            this.val = "";
            dojo.place(this.testSubject, this.domNode, "after");
            this.updateSize();
        },

        updateSize: function() {
            if (this.val === (this.val = this.attr("value"))) {return;}
            var input = this.domNode;
            
            // Enter new content into testSubject
            var escaped = this.val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            this.testSubject.innerHTML = escaped;

            // Calculate new width + whether to change
            var testerWidth = getWidth(this.testSubject),
                newWidth = (testerWidth + this.comfortZone) >= this.minWidth ? testerWidth + this.comfortZone : this.minWidth,
                currentWidth = getWidth(input),
                isValidWidthChange = (newWidth < currentWidth && newWidth >= this.minWidth)
                                     || (newWidth > this.minWidth && newWidth < this.maxWidth);
                        
            // Animate width
            if (isValidWidthChange) {
                dojo.style(input, "width", newWidth + "px");
            }
        },
        
        destroy: function() {
            dojo.destroy(this.testSubject);
            this.inherited(arguments);
        }
    });
    return ResizableTextBox;
});
