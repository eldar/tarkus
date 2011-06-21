var fs = require("fs");
var _ = require("Global")._;

var PROJECTS_DIR = "/var/tarkus/eldar";

var ignoreDirs = [".git", ".hg", ".svn"];

var isValidDirectory = function(name) {
    var result = true;
    _.each(ignoreDirs, function(ignored) {
        if(name === ignored)
            result = false;
    });
    return result;
}

var HandlerObj = function(socket) {
    this._socket = socket;
}

var getDirStructure = function(path) {
    var res = {
        files: [],
        dirs: []
    };
    var list = fs.readdirSync(path);
    _.each(list, function(elem) {
        var stat = fs.lstatSync(path + "/" + elem);
//        console.log(elem);
        if(stat.isDirectory() && isValidDirectory(elem)) {
            res.dirs.push({
                name: elem,
                content: getDirStructure(path + "/" + elem)
            });
        } else if(stat.isFile()) {
            res.files.push(elem);
        }
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
        return this._fullPath(data.projectName, data.path);
    },

    _fullPath: function(projectName, relativePath) {
        var path = relativePath.replace(/^\s*|\/*\s*$/g, '');
        console.log("relative path " + path);
        return this._projectDir(projectName) + "/" + path;
    },
    
    _respond: function(msg) {
        msg.type = "response";
        this._socket.send(msg);
    },

    projectCreate : function(msg) {
        var data = msg.data;
        var path = this._projectDir(data.projectName);
        console.log("creating project at " + path);
        var self = this;
        fs.mkdir(path, 0777, function() {
//            self.fileCreate(_.extend(data, { path: ".project-definition"}));
        });
    },

    folderCreate: function(msg) {
        fs.mkdir(this._nodeFullPath(msg.data), 0777);
    },
    
    fileCreate: function(msg) {
        var path = this._nodeFullPath(msg.data);
        console.log("creating file " + path);
        fs.open(path, "w+", 0777, function(err, fd) {
            fs.close(fd);
        });
    },
    
    requestFileContent: function(msg) {
        var path = this._nodeFullPath(msg.data);
        console.log("File path " + path);
        var self = this;
        fs.readFile(path, function (err, buffer) {
//            if (err) throw err;
            console.log("read file");
            msg.data = buffer.toString("utf8");
            self._respond(msg);
        });
    },
    
    saveFile: function(msg) {
        var data = msg.data;
        var path = this._nodeFullPath(data);
        console.log("writing to file " + path);
        fs.writeFile(path, data.content);
    },
    
    projectOpen: function(msg) {
        var path = this._projectDir(msg.data.projectName);
        msg.data = getDirStructure(path);
//        console.log(msg.data);
        this._respond(msg);
    },
    
    getProjectList: function(msg) {
        var list = fs.readdirSync(this._projectsDir());
        console.log(list);
        msg.data = { list: list};
        this._respond(msg);
    },
    
    renamePath: function(msg) {
        var data = msg.data;
        var path = this._nodeFullPath(data);
        var newPath = this._fullPath(data.projectName, data.newPath);
        var self = this;
        console.log("old path " + path);
        console.log("new path " + newPath);
        fs.rename(path, newPath, function(err) {
            self._respond(msg);
        });
    },
    
    deletePath: function(msg) {
        var data = msg.data;
        var path = this._nodeFullPath(data);
        console.log("deleting " + path);
        var self = this;
        fs.unlink(path, function() {
            self._respond(msg);
        });
    }
}

exports.MsgHandler = function(socket) {
    this.handler = new HandlerObj(socket);
}

exports.MsgHandler.prototype = {
    handle: function(msg) {
        console.log("--- Handling Message ---");

        var h = this.handler;
        var name = msg.name;
        if(h[name]) {
            console.log("message " + name);
            h[name].call(h, msg);
        } else
            console.log("Failed to respond to message " + name);
    }
}
