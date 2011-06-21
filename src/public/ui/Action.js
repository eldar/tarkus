define([
    "dojo",
    "sumo/ui/Action",
    "ui/Keyboard",
    "pilot/canon"
], function (dojo, Action, keyboard, canon) {

    var Action = dojo.declare(Action, {
        
        EDITOR:   0x0001,
        CONSOLE:  0x0010,
        DOCUMENT: 0x0100,
        ALL:      0x0111,
                
        constructor: function(params) {
            var parm = params.keyBinding;
            if(!parm)
                return;
            var extent = parm.extent || this.ALL;
            var pilotSender = "";
            if(extent & this.EDITOR)
                pilotSender += "editor";
            var self = this;
            if(pilotSender) {
                canon.addCommand({
                    name: params.label,
                    bindKey: {
                        win: parm.win,
                        mac: parm.mac,
                        sender: "editor"
                    },
                    exec: function(env, args, request) {
                        self.triggered(env);
                    }
                });
            }
            keyboard.bind(parm, document, function(event) {
                if(extent & self.DOCUMENT)
                    self.triggered();
                event.preventDefault();
            });
            params.accelKey = parm.win;
        }
    });
    return Action;
});
