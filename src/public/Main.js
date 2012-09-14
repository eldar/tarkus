require(["require", "core/Global", "core/PluginManager", "core/Ide", "dojo/domReady!"],
        function(require, Global, PluginManager) {
    var pluginManager = new PluginManager({ basePath: "plugins"});
    pluginManager.load(["core", "editors", "documents", "project"]);
});
