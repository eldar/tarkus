require({    
    paths: {
        ace : "ace/lib/ace",
        pilot: "pilot/lib/pilot"
    }
});

var plugins = [ "pilot/index", "ace/defaults" ];

var deps = [
    "core/global",
    "pilot/plugin_manager",
    "pilot/environment",
    "ide/core/MainArea",
    "ide/core/MainMenu",
    "core/editor"
    
    //"pilot/fixoldbrowsers",
    //"pilot/settings"
];  

require(deps, function(
    global,
    pluginManager,
    pilotEnv,    
    mainArea,
    mainMenu,
    editor,
    openedDocs,
    projectTree,
    actions,
    bodyTempl) {
    
    var catalog = pluginManager.catalog;
       
    catalog.registerPlugins(plugins).then(function() {
        var env = pilotEnv.create();
        catalog.startupPlugins({ env: env }).then(function() {        
            require.ready(function() {
                global.env = env;
                
/*                openedDocs.init();
                
                actions.init();
                projectTree.init();
*/
                editor.init(env);
            });
        });
    });
    
});
