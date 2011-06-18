define(["dojo"], function(dojo) {

    var modMap = {
        "Ctrl": "ctrlKey",
        "Shift": "shiftKey",
        "Alt": "altKey",
        "Command": "metaKey"
    };

    return {
        bind: function(keyCodes, elem, handler) {
            if(dojo.isString(keyCodes))
                keyCodes = [keyCodes];
            else if(!dojo.isArray(keyCodes))
                return;
            
            var excluded = [];
            _.each(modMap, function(value) {
                excluded.push(value);
            });
            
            dojo.forEach(keyCodes, function(keyCode) {
                var keys = keyCode.split("-");
                var mods = [];
                var action = "";
                _.each(keys, function(key) {
                    var mod = modMap[key];
                    if(mod) {
                        mods.push(mod);
                        excluded = _.without(excluded, mod);
                    } else {
                        action = key;
                    }
                });

                dojo.connect(elem, "onkeypress", function(event) {
                    // check whether specified modifiers are pressed
                    var matches = _.every(mods, function(mod) {
                        return event[mod];
                    }, true);
                    
                    // check whether key is pressed
                    matches &= event.keyChar.toUpperCase() === action.toUpperCase();
                    
                    // check if not specified modifiers are not pressed
                    matches &= _.every(excluded, function(mod) {
                        return !event[mod];
                    });

                    if(matches)
                        handler(event);
                });
            });
        }
    };
});
