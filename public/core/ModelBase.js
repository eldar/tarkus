define(["dojo"], function() {
    return dojo.declare(null, {
        // reimplementation of dijit.tree.model

        getRoot: function(onItem, onError) {
            onItem(this.root());
        },
        
        mayHaveChildren: function(item) {
            var children = item.children;
            return children ? children.length != 0 : false;
        },
        
        getChildren: function(parentItem, callback, onError) {
            callback(parentItem.children);
        },
        
        getLabel: function(item) {
            return item.name;
        },
                
        isItem: function(something) {
            return something.id;
        },
        
        getIdentity: function(item) {
            return item.id;
        },
        
		onChildrenChange: function(parent, newChildrenList) {
		},
		
		notifyChildrenChanged: function(parent) {
		    this.getChildren(parent, dojo.hitch(this, function(children){
			    this.onChildrenChange(parent, children);
			}));
		}
    });
})
