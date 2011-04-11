var deps = [
    "jquery-ui/jquery-ui-1.8.11.custom.min",
    "ui-misc/splitter",
    "ui-misc/jstree",
    "pilot/fixoldbrowsers", "pilot/plugin_manager",
    "pilot/settings", "pilot/environment",
    "core/edit-area",
    "project-explorer/project-tree-widget"
];

var plugins = [ "pilot/index", "ace/defaults" ];

require(["jquery"], function($) {
    $(document).ready(function() {
        require(deps, function() {
            var catalog = require("pilot/plugin_manager").catalog;
            catalog.registerPlugins(plugins).then(function() {
                var env = require("pilot/environment").create();
                catalog.startupPlugins({ env: env }).then(function() {
                    var x = 3;
                });
            });
        });
    });
});
