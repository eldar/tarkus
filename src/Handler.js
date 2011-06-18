var path = require("path");
var url = require("url");
var fs = require("fs");
var mem = require("./Memory");

exports.Handler = function(options)
{
    options = options || {};
    this.handlersDir = options.handlersDir;
}

exports.Handler.prototype = {

    handle : function(req, res, next) {
        console.log("in handler " + req);
    
        //TODO: move to a separate middleware
        if (!req.parsedUrl)
            req.parsedUrl = url.parse(req.url, true);
            
        req.subPathNodes = [];
        
        // remove the leading and trailing "/"
        var relBasePath = req.parsedUrl.pathname.substr(1);
        if (relBasePath.length && relBasePath.charAt(relBasePath.length - 1) == '/')
            relBasePath = relBasePath.slice(0, relBasePath.length - 1);
        req.relPath = req.relBasePath = relBasePath;
            
        var mod = this._load(req);

        if (mod) {
            var subPathNodes = req.subPathNodes;

            if (subPathNodes.length >= 1) {
                var command = subPathNodes[0];
                if (mod[command]) {
                    subPathNodes.shift();
                    mod[command](req, res, next);
                    return;
                }                                                
            } 
            
            if (mod.handle)
                mod.handle(req, res, next);
        } else
            next();
    },
    
    _load : function(req) {
        var relBasePath = req.relBasePath;
        var fullPath = path.join(this.handlersDir, relBasePath);

        // TODO: using exceptions may be slow
        try {             
            return require(fullPath);
        } catch (e) {       
            try {
                return requre(path.join(fullPath, "index"));                                 
            } catch(e) {
                if (!relBasePath.length || relBasePath == ".")
                    return null;
                                 
                req.subPathNodes.unshift(path.basename(relBasePath));
                req.relBasePath = path.dirname(relBasePath);               
                return this._load(req);
            }
        }
    }
}

exports.createHandler = function(options)
{
    return new exports.Handler(options);
}

