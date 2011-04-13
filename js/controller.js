var path = require("path");
var fs = require("fs");

exports.Controller = function(options)
{
}

exports.Controller.prototype = {
    resolve : function(path) {
    }
}

exports.ControllerCache = function(options)
{
    options = options || {};
    this.cache = new Cache();
    this.controllersDir = options.controllersDir;
    this.controllerExt = ".ctl";
}

exports.ControllerCache.prototype = {
    get : function(url, next) {
        ctlOpts = path.parse(url, true);
        ctlOpts.fullPath = path.join(this.controllersDir, parsedUrl.pathname);
        
        var ctl = this.cache.get(ctlOpts.pathname);
        if (ctl)
            return ctl;
            
        var fsStat = fs.stat(ctlOpts.fullPath, function(err) {
            if (err) {
                // throw
            } else {
                var ctlModule = require(ctlOpts.fullPath);
                ctl = ctlModule.createController(ctlOpts);
                next(ctl);
            }            
        });

        
    }

}


