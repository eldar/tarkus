var StoreBase = require('connect').session.Store;
var _ = require("./Global")._;

exports.Store = _.inherits(StoreBase, {
    constructor: function() {
        this._sessions = {};
    },

    get: function(sid, callback) {
        var data = this._sessions[sid];        
        var sess = data ? JSON.parse(data) : data;
        callback(null, sess);
    },

    set: function(sid, sess, callback) {        
        this._sessions[sid] = JSON.stringify(sess);
        callback && callback.call(this, sid, sess);
    },

    destroy: function(sid, callback) {
        delete this._sessions[sid];
        callback && callback.call(this, sid);
    }
});
