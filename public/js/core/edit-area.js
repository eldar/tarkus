var deps = [
    "jquery",
    "core/global"
];

define(deps, function($) {

return {
    init: function() {
        $(".tarkus-toolbutton").button();

        // default options copied from js ui layout "complex" demo
        var layoutOuter = {
            // options.defaults apply to ALL PANES - but overridden by pane-specific settings
            defaults: {
                size:                   "auto",
                minSize:                50,
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
            },
            east: {
                size:                   250,
                spacing_closed:         21,          // wider space when closed
                togglerLength_closed:   21,          // make toggler 'square' - 21x21
                togglerAlign_closed:    "top",       // align to top of resizer
                togglerLength_open:     0,           // NONE - using custom togglers INSIDE east-pane
                togglerTip_open:        "Close East Pane",
                togglerTip_closed:      "Open East Pane",
                resizerTip_open:        "Resize East Pane",
                slideTrigger_open:      "mouseover",
                //  override default effect, speed, and settings
                fxName:                 "drop",
                fxSpeed:                "normal",
                fxSettings:             { easing: "" } // nullify default easing
            }
        };
        $("body").layout(layoutOuter);
        $("#left-pane").layout(layoutOuter);
    }
};

});
