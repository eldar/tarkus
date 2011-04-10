var deps = [ "pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings",
             "pilot/environment", "demo" ];

var plugins = [ "pilot/index", "ace/defaults" ];

require(["jquery"], function($) {
    require(deps, function() {
        var catalog = require("pilot/plugin_manager").catalog;
        catalog.registerPlugins(plugins).then(function() {
            var env = require("pilot/environment").create();
            catalog.startupPlugins({ env: env }).then(function() {
                require("demo").launch(env);
            });
        });
    });
});