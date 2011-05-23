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
    "core/edit-area",
    "core/editor",
    "core/open-docs-widget",
    "project-explorer/tree-widget",
    "project-explorer/actions",
    "text!../templates/ide-body.html",

    "pilot/fixoldbrowsers",
    "pilot/settings"
];  

require(deps, function(
    global,
    pluginManager,
    pilotEnv,    
    editArea,
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
                $("body").html(bodyTempl);

                global.env = env;
                
                editArea.init();
                openedDocs.init();
                
                actions.init();
                projectTree.init();
                editor.init(env);                
            });
        });
    });
    
});


