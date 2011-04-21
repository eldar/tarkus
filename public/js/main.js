require({    
    paths: {
        ace : "ace/lib/ace"
    }
});

var plugins = [ "pilot/index", "ace/defaults" ];

var deps = [
    "core/global",
    "pilot/plugin_manager",
    "pilot/environment",
    "core/edit-area",
    "core/editor",
    "project-explorer/tree-widget",
    "project-explorer/actions",    

    "pilot/fixoldbrowsers",
    "pilot/settings"
];  

require(deps, function(
    global,
    pluginManager,
    pilotEnv,    
    editArea,
    editor,
    projectTree,
    actions) {
    
    var catalog = pluginManager.catalog;
       
    catalog.registerPlugins(plugins).then(function() {
        var env = pilotEnv.create();
        catalog.startupPlugins({ env: env }).then(function() {        
            require.ready(function() {
                global.env = env;
                
                editArea.init();
                actions.init();
                projectTree.init();
                editor.init(env);                
            });
        });
    });
    
});


