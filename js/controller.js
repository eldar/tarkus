var path = require("path");

exports.Controller = function(route)
{
    this.route = route;       
}

exports.Controller.prototype = {
    resolve : function(path) {
    }
}

exports.ControllerCache = function(options)
{
    options = options || {};
    this.cache = new Cache();
    this.controllersDir = options.controllersDir || ;
}

exports.ControllerCache.prototype = {
    getController : function(url) {
        var fullPath = path.join(controllersDir, url);
    }

    registerRoute : function(route, method) {
    } 
}


