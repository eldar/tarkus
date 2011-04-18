exports.handle = function(req, res, next) {
    //console.log("Index ", req.relPath, " ", req.relBasePath);
    //res.render(req.relPath);
    next();
}

