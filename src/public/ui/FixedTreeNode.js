define([
    "dojo",
    "dijit/Tree"
], function(dojo) {
    return dojo.declare(dijit._TreeNode, {
        _trackMouseState: function(/*DomNode*/ node, /*String*/ clazz){
            var hovering=false, active=false;
            this._focused = false;
            
            var self = this,
                cn = dojo.hitch(this, "connect", node);

            function setClass(reason){
                var disabled = ("disabled" in self && self.disabled) || ("readonly" in self && self.readonly);

//                console.log(reason + " class " + clazz + " element '" + self.item.name + "' focused " + self._focused + " hovering " + hovering + " hovered " + (!self._focused && hovering && !disabled));
                
                dojo.toggleClass(node, clazz+"Hover", !self._focused && hovering && !disabled);
                dojo.toggleClass(node, clazz+"Focused", self._focused && !disabled);
            }

            // Mouse
            cn("onmouseenter", function(){
                hovering = true;
                setClass("onmouseenter");
            });
            cn("onmouseleave", function(){
                hovering = false;
                active = false;
                setClass("onmouseleave");
            });

            // Focus
            cn("onfocus", function(){
                this._focused = true;
                setClass("onfocus");
            });
            cn("onblur", function(){
                this._focused = false;
                setClass("onblur");
            });

            // Just in case widget is enabled/disabled while it has focus/hover/active state.
            // Maybe this is overkill.
            this.watch("disabled", setClass);
            this.watch("readOnly", setClass);
        }
    });
});
