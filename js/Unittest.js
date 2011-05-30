var assert = require("assert");

var config = require("./Config");
var _ = require("./Global")._;

exports = module.exports = function() {
    if (config.unittest) {
        _.each(arguments, function(unittest) {
            unittest(assert);
        });
    }            
}
