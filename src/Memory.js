/*
*/

var _ = require("underscore");
var timers = require("timers");

exports.Cache = function(options) {
    this.options = options || {};
}

exports.Cache.prototype = {
    _items : {},

    set : function(key, value, options) {
        options = _.extend(this.options, options);        

        var renew = options.renew;
        if (value === undefined && renew)
            value = renew(key, this);

        if (value !== undefined)          
            this._items[key] = { value : value, options : options };
        else
            remove(key);

        var timeout = options.timeout;
    
        if (timeout && renew)
            timers.setTimeout(_.bind(set, this, key, undefined, options), timeout);
    },

    remove : function(key) {
        delete _items[key];
    },   

    get : function(key) {
        var item = items[key];
        if (item === undefined)
            return undefined;
        else {
            var options = item.options;
            var validate = options.validate;
            if (validate && validate(key, this))
                this.set(key, undefined, options);
        }
    },

    clear : function () {
		_items = {};
    }
}
