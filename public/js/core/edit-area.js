var deps = [
    "jquery",
    "core/global"
];

define(deps, function($, global) {

return {
    init: function() {
        $(".tarkus-toolbutton").button();

        var mainMenu = {
            _callbacks: {},
       
            container: function() {
                return $("#menubar");
            },
       
            addCallback: function(id, callback) {
                this._callbacks[id] = callback;
            },
            
            handle: function(id) {
                var cb = this._callbacks[id];
                if(cb)
                    cb();
            },
            
            getActionDom: function(id) {
                return this.container().find("#" + id);
            },
            
            setActionText: function(id, text) {
                this.getActionDom(id).children("a").text(text);
            },
            
            setActionEnabled: function(id, enabled) {
                var elem = this.getActionDom(id);
                if(enabled)
                    elem.removeClass("ui-state-disabled");
                else
                    elem.addClass("ui-state-disabled");
            }
        };
        global.mainMenu = mainMenu;
        
        mainMenu.container().menubar({
            menuIcon: true,
            select: function(event, ui) {
                mainMenu.handle(ui.item.attr("id"));
            }
        }).disableSelection();
        // round corners in submenus only for bottom border
        $("#menubar > li > .ui-menu").removeClass("ui-corner-all").addClass("ui-corner-bl ui-corner-br");
        
        var onEditorResize = function() {
            global.editorResize();
        };
        
        // options.defaults apply to ALL PANES - but overridden by pane-specific settings
        var defaults = {
            size:                   "auto",
            resizeWhileDragging:    true,
            paneClass:              "pane",      // default = 'ui-layout-pane'
            resizerClass:           "resizer",   // default = 'ui-layout-resizer'
            togglerClass:           "toggler",   // default = 'ui-layout-toggler'
            buttonClass:            "button",    // default = 'ui-layout-button'
            contentSelector:        ".content",  // inner div to auto-size so only it scrolls, not the entire pane!
            contentIgnoreSelector:  "span",      // 'paneSelector' for content to 'ignore' when measuring room for content
            togglerLength_open:     35,          // WIDTH of toggler on north/south edges - HEIGHT on east/west edges
            togglerLength_closed:   35,          // "100%" OR -1 = full height
            hideTogglerOnSlide:     true,        // hide the toggler when pane is 'slid open'
            togglerTip_open:        "Close This Pane",
            togglerTip_closed:      "Open This Pane",
            resizerTip:             "Resize This Pane",
                //  effect defaults - overridden on some panes
            fxName:                 "slide",     // none, slide, drop, scale
            fxSpeed_open:           750,
            fxSpeed_close:          1500,
            fxSettings_open:        { easing: "easeInQuint" },
            fxSettings_close:       { easing: "easeOutQuint" },
        };

        // default options copied from js ui layout "complex" demo
        var layoutOuter = {
            defaults: defaults,
            north: {
                resizable: false,
                slidable:  false,
                zIndex: 20000
            },
            east: {
                size: 250
            },
            center: {
                onresize: onEditorResize
            }
        };
        var layoutLeft = {
            defaults: defaults,
            north: {
                size: 300
            }
        };
        var container = $("#mainsplit");
        var mainLayout = container.layout(layoutOuter);
        $("#left-pane").layout(layoutLeft);

        container.children(".ui-layout-north").hover(function() {
            mainLayout.allowOverflow(this);
        }, function() {
            mainLaoyut.resetOverflow(this);
        });
    }
};

});
