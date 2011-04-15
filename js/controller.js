var path = require("path");
var url = require("url");
var fs = require("fs");
var mem = require("./memory");

exports.ControllerHandler = function(options)
{
    options = options || {};
    this.controllersDir = options.controllersDir || __dirname + "/controllers";
}

exports.ControllerHandler.prototype = {

    handle : function(req, res, next) {
        console.log("in handler " + req);
    
        //TODO: move to separate middleware
        if (!req.parsedUrl)
            req.parsedUrl = url.parse(req.url, true);
            
        req.subPathNodes = [];
        
        // remove the leading and trailing "/"
        var relPath = req.parsedUrl.pathname.substr(1);
        if (relPath.length && relPath.charAt(relPath.length - 1) == '/')
            relPath = relPath.slice(0, relPath.length - 1);
        req.relPath = relPath;
        
        console.log("controller: ", relPath);
            
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
        var relPath = req.relPath;
        var fullPath = path.join(this.controllersDir, relPath);

        try {             
            return require(fullPath);
        } catch (e) {        
            try {
                return requre(path.join(fullPath, "index"));                                 
            } catch(e) {
                if (!relPath.length || relPath == ".")
                    return null;
                                 
                req.subPathNodes.unshift(path.basename(relPath));
                req.relPath = path.dirname(relPath);               
                return this._load(req);                
            }
        }
    }
}

exports.createHandler = function(options)
{
    return new exports.ControllerHandler(options);
}
