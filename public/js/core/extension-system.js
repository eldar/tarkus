define(function() {
    return {
        PluginSpec : function() {
            this.name = "";
            this.version = "";
        },
        
        Plugin : function() {
            this.initialize = function() {};
            this.extensionsInitialized = function() {};
            this.aboutToShutdown = function() {};
        }
    }
});
