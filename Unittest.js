var config = require("./Config");
var _ = require("Global")._;
var assert = config.unittest ? require("assert") : undefined;

exports = module.exports = function() {
    if (config.unittest) {
        _.each(arguments, function(unittest) {
            unittest(assert);
        });
    }            
}
