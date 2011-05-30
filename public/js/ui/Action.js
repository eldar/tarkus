var deps = [
    "dojo",
    "dojo/Stateful",
    "dijit/MenuItem"
];

define(deps, function (dojo, Stateful, MenuItem) {

    dojo.declare("Action", Stateful, {

        constructor: function(params) {
            this._params = params;
            this.disabled = false;
            this.label = params.label || "";
            this._widgets = [];
            this._dispatchProperty("disabled");
            this._dispatchProperty("label");
        },
        
        _dispatchProperty: function(name) {
            this.watch(name, function(name, oldValue, newValue) {
                dojo.forEach(this._widgets, function(item){
                    item.set(name, newValue);
                });
            });
        },
        
        makeMenuItem: function(params, srcNodeRef) {
            var itemParams = dojo.mixin(params, this._params, {
                onClick: dojo.hitch(this, "triggered")
            });
            var item = MenuItem(itemParams, srcNodeRef);
            this._widgets.push(item);
            return item;
        },
        
        triggered: function() {}
    });
    return Action;
});
