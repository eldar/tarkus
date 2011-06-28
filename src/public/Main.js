require([
    "pilot/plugin_manager",
    "pilot/environment"
], function(
    pluginManager,
    pilotEnv) {
    
    // loads ace&pilot stuff and calls callback on success
    var onLoadPilot = function(callback) {
        var catalog = pluginManager.catalog;

        var plugins = [ "pilot/index", "ace/defaults" ];
        catalog.registerPlugins(plugins).then(function() {
            var env = pilotEnv.create();
            catalog.startupPlugins({ env: env }).then(function() { callback(); });
        });
    }

    onLoadPilot(function() {
        require(["core/Global", "core/PluginManager", "core/Ide", "dojo/domReady!"], function(Global, PluginManager) {
            var pluginManager = new PluginManager({ basePath: "plugins"});
            pluginManager.load(["core", "editors", "documents", "project"]);
        });
    });
});
