require([
    "pilot/plugin_manager",
    "pilot/environment",
    "pilot/fixoldbrowsers"
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
        require.ready(function() { // on DOM loads
            require([
                "core/global",
                "ide/core/MainArea",
                "ide/core/MainMenu",
                "core/editor",
                "ide/project/Handlers",
                "ide/project/Tree"
            ]);
        });
    });
});
