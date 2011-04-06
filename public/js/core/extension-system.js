var tarkus = {};

tarkus.core = {};

tarkus.core.PluginSpec = function()
{
    this.name = "";
    this.version = "";
}

tarkus.core.Plugin = function()
{
    this.initialize = function() {};
    this.extensionsInitialized = function() {};
    this.aboutToShutdown = function() {};
}