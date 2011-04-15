var ace_deps = [ "pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings",
             "pilot/environment", "core/editor" ];

var deps = [
    "jquery-ui/jquery-ui",
    "ui-misc/splitter",
    "ui-misc/jstree",
    "core/global",
    "core/edit-area",
    "project-explorer/project-tree-widget",
    "project-explorer/project-actions"
];

var plugins = [ "pilot/index", "ace/defaults" ];

require(["jquery"], function($) {
$(document).ready(function() {

require(ace_deps, function() {
    var catalog = require("pilot/plugin_manager").catalog;    
       
    catalog.registerPlugins(plugins).then(function() {
        var env = require("pilot/environment").create();
        catalog.startupPlugins({ env: env }).then(function() {
            require(deps, function() {
	            var editor = require("core/editor");	            
	            require.ready(function() {
	                editor.launch(env);
	            });
	        });
        });
    });
    
});

});
});
