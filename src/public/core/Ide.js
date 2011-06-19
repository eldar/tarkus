define(function() {
    return {
        _data: {},
        
        register: function(name, obj) {
            if(!this._data[name])
                this._data[name] = obj;
        },
        
        query: function(name) {
            return this._data[name];
        }
    };
});
