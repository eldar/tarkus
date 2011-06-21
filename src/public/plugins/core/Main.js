define([
    "plugins/core/MainArea",
    "plugins/core/MainMenu",
    "plugins/core/Actions"
], function(mainArea, mainMenu, actions) {

    var ide = require("core/Ide");

    return {
        init: function() {
            mainArea.init();
            actions.init();
            mainMenu.init();
        }
    };
});
