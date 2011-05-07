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
        ".list-widget a {text-decoration:none;} " +
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
                a.css("color", "black");
                var title = js.data.title;
                a.html(title);
                d.append(a);
            }
            this.container().children("ul").prepend(d);
            if(callback) { callback.call(this, d); }
        }
    });
}

};
});