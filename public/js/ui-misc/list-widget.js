/*
 * Widget to display lists of data
 */

var deps = [
    "jquery"
]

define(deps, function($) {
return {

init: function() {
    var Widget = null;
    
    var css_string = "" +
        ".list-widget ul {list-style: none; margin-left: 0px; padding-left: 0px;} " +
        ".list-widget ul {list-style: none; margin-right: 0px; padding-right: 0px;} " +
        ".list-widget a {display:inline-block; white-space:nowrap; text-decoration:none;} " +
        ".list-widget a:focus {outline:none;} ";

    $.vakata.css.add_sheet({ str : css_string, title : "listWidget" });
    
    $.fn.listWidget = function(config) {
        var isMethodCall = (typeof config == 'string');
        var returnValue = this;

        if(isMethodCall) {
            var m = $(this).data("listWidget");
            // Method calling logic
            if(m[config]) {
                return m[ config ].apply( m, Array.prototype.slice.call( arguments, 1 ));
            } else {
                $.error( 'Method ' +  config + ' does not exist for jQuery.listWidget' );
            }
        } else {
            $(this).data("listWidget", new Widget($(this), config));
        }
        
        return returnValue;
    };
    
    Widget = _.inherits(Object, {
        _elem: null,
        _config: null,
        _lastSelected: null,
        
        constructor: function(elem, conf) {
            this._elem = elem;
            this._config = conf;
            
            this.container().addClass("list-widget").html("<ul></ul>");
        },
        
        container: function() {
            return this._elem;
        },
        
        createNode: function(js, callback) {
            var d = $("<li />");
            d.append("&nbsp;"); // indentation, FIXME properly
            
            if(js.attr) { d.attr(js.attr); }
            if(js.data) {
                var a = $("<a />");
                a.attr("href", "#");
                a.attr("id", "main-elem");
                a.addClass("list-view-unclicked-a");
                var title = js.data.title;
                a.html(title);
                d.append(a);
            }
            this.container().children("ul").prepend(d);
            if(callback) { callback.call(this, d); }
            
            // selection handling
            d.hover(function() {
                $(this).addClass("list-view-hovered")
            }, function() {
                $(this).removeClass("list-view-hovered")
            });
            var th = this;
            d.click(function() {
                th.selectNode($(this));
            });
        },
        
        selectNode: function(newNode) {
            if(this._lastSelected) {
                var cond = this._lastSelected.is(newNode);
                if( cond )
                    return;
                this._lastSelected.removeClass("list-view-clicked");
                var link = this._lastSelected.children("#main-elem");
                link.removeClass("list-view-clicked-a");
                link.addClass("list-view-unclicked-a");
            }
            this._lastSelected = newNode;
            newNode.addClass("list-view-clicked");
            var link = newNode.children("#main-elem");
            link.addClass("list-view-clicked-a");
            link.removeClass("list-view-unclicked-a");
                
            this.container().trigger("listView.selectNode", newNode);
        },
        
        getTitle: function() {
        }
    });
}

};
});