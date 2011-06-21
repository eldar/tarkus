define(["dojo", "pilot/promise"], function(dojo, promise) {
    var Promise = promise.Promise;

    var Plugin = dojo.declare(null, {
        constructor: function(path) {
            this.path = path;
        },
        
        main: function() {
            return this.path + "/Main.js";
        },
        
        register: function() {
            var promise = new Promise();
            var self = this;
            require([this.main()], function(pluginBody) {
                self.data = pluginBody;
                promise.resolve(self);
            });
            return promise;
        }
    });
    
    return dojo.declare(null, {
        basePath: "",
        
        constructor: function(params) {
            this._plugins = [];
            dojo.safeMixin(this, params);
        },
        
        load: function(pluginList, callback) {
            var self = this;
            _.each(pluginList, function(name) {
                self._plugins.push(new Plugin(self.basePath + "/" + name));
            });

            var registrationPromises = [];
            // load plugin sources
            _.each(this._plugins, function(plugin) {
                registrationPromises.push(plugin.register());
            });
            
            Promise.group(registrationPromises).then(function() {
                _.each(self._plugins, function(plugin) {
                    var init = plugin.data.init;
                    if(init)
                        init();
                });
                if(callback)
                    callback();
            });
        }
    });
});
