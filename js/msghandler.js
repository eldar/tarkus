var fs = require("fs");
var _ = require("./global")._;

var PROJECTS_DIR = "/data/tarkus/projects";

var HandlerObj = function(socket) {
    this._socket = socket;
}

var getDirStructure = function(path) {
    var res = {}
    res.files = [];
    res.dirs = {};
    var list = fs.readdirSync(path);
    _.each(list, function(elem) {
        var stat = fs.lstatSync(path + "/" + elem);
        console.log(elem);
        if(stat.isDirectory())
            res.dirs[elem] = getDirStructure(path + "/" + elem);
        else if(stat.isFile())
            res.files.push(elem)
    });
    return res;
};

HandlerObj.prototype = {
    _projectsDir: function() {
        return PROJECTS_DIR;
    },
    
    _projectDir: function(name) {
        return this._projectsDir() + "/" + name;
    },
    
    _nodeFullPath: function(data) {
        var path = data.path.replace(/^\s*|\/*\s*$/g, '');
        console.log("relative path " + path);
        return this._projectDir(data.projectName) + "/" + path;
    },
    
    _reply: function(e, data) {
        this._socket.send({
            message: e.message,
            type: "responce",
            data: data
        });
    },
    
    projectCreate : function(data) {
        var path = this._projectDir(data.projectName);
        console.log("creating project at " + path);
        var self = this;
        fs.mkdir(path, 0777, function() {
//            self.fileCreate(_.extend(data, { path: ".project-definition"}));
        });
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
    
    requestFileContent: function(data, e) {
        var path = this._nodeFullPath(data);
        console.log("File path " + path);
        var self = this;
        fs.readFile(path, function (err, buffer) {
//            if (err) throw err;
            console.log("read file");
            var content = buffer.toString("utf8");
            console.log(content);
            self._reply(e, content);
        });
    },
    
    saveFile: function(data) {
        console.log(data.content);
        var path = this._nodeFullPath(data);
        console.log("writing to file " + path);
        fs.writeFile(path, data.content);
    },
    
    projectOpen: function(data, e) {
        var path = this._projectDir(data.projectName);
        var res = getDirStructure(path);
        console.log(res);
        this._reply(e, res);
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
        if(h[msg]) {
            console.log("message " + msg);
            h[msg].call(h, e.data, e);
        } else
            console.log("Failed to respond to message " + msg);
    }
}