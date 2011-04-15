exports.handle = function(req, res, next) {
    console.log("index " + req.subPathNodes);
    res.end();
}

