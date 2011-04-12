/*
*/

exports.Cache = function(options) {
    this.options = options;
}

exports.Cache.prototype = {
    _items : {},

    set : function(key, value, options) {
        var opts = util.merge(this.options, options);

        if (value === undefined && options && options.renew)
            value = options.renew(key, this);

        if (value !== undefined)          
            this._items[key] = { value : value, options : opts }
        else
            remove(key);

        var self = this;
        if (opts && opts.interval)
            setTimer()            
    },

    remove : function(key) {
        delete _items[key];
    },   

    get : function(key) {
        var item = items[key];
        if (item) {
            var opts = item.options;
            if (opts && opts.validate && opts.validate(key, this)) {
                this.set(key, undefined, options);
            }
        }
        else
            return undefined;
    },

    clear : function () {
		_items = {}
    }
}
