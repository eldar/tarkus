
var deps = [
    "jquery-ui/jquery-ui-1.8.11.custom.min",
    "ui-misc/splitter",
    "ui-misc/jstree",
    "core/edit-area",
    "project-explorer/project-tree-widget"
];
/*
var plugins = [ "pilot/index", "ace/defaults" ];

var ace_deps = [ "pilot/fixoldbrowsers", "pilot/plugin_manager",
                 "pilot/settings", "pilot/environment" ];
*/

require(["jquery"], function($) {
    $(document).ready(function() {
        require(deps);
    });
});

/*
var deps = [ "pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings",
             "pilot/environment" ];

var plugins = [ "pilot/index", "ace/defaults" ];
require(deps, function() {
    var catalog = require("pilot/plugin_manager").catalog;
    catalog.registerPlugins(plugins).then(function() {
        var env = require("pilot/environment").create();
        catalog.startupPlugins({ env: env }).then(function() {
            var x = 3;
        });
    });
});
*/