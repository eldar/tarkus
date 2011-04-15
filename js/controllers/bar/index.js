exports.handle = function(req, res, next) {
    console.log("index 2" + req.subPathNodes);
    res.end();
}

