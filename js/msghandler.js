var fs = require("fs");

var PROJECTS_DIR = "/data/tarkus/projects";

var HandlerObj = function(socket) {
    this._socket = socket;
}

HandlerObj.prototype = {
    _projectsDir: function() {
        return PROJECTS_DIR;
    },
    
    _projectDir: function(name) {
        return this._projectsDir() + "/" + name;
    },
    
    projectCreate : function(data) {
        var path = this._projectDir(data.projectName);
        console.log("creating project at " + path);
        fs.mkdir(path, 0777);
    },

    _nodeFullPath: function(data) {
        var path = data.path.replace(/^\s*|\/*\s*$/g, '');
        console.log("relative path " + path);
        return this._projectDir(data.projectName) + "/" + path;
    },
    
    folderCreate: function(data) {
        fs.mkdir(this._nodeFullPath(data), 0777);
    },
    
    fileCreate: function(data) {
        var path = this._nodeFullPath(data);
        console.log("creating file " + path);
        fs.open(path, "w+", 0777, function(err, fd) {
            fs.close(fd);
        });
    },
    
    requestFileContent: function() {
        console.log("requestFileContent");
        this._socket.send({hello: "world"});
    }
}

exports.MsgHandler = function(socket) {
    this.handler = new HandlerObj(socket);
}

exports.MsgHandler.prototype = {
    handle: function(e) {
        console.log("--- Handling Message ---");

        var h = this.handler;
        var msg = e.message;
        if(h[msg])
            h[msg].call(h, e.data);
        else
            console.log("Failed to respond to message " + msg);
    }
}