exports.handle = function(req, res, next) {
    console.log("test " + req.subPathNodes);
    res.end();
}

exports.foo = function(req, res, next) {
    console.log("foo " + req.subPathNodes);
    res.end();
} 

