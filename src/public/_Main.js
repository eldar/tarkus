require({
    baseUrl: ".",
    // set the paths to our library packages
    packages: [
        { name: 'dojo', location: '3rdparty/dojo', lib: '.' },
        { name: 'dijit', location: '3rdparty/dijit', lib: '.' },
        { name: 'dojox', location: '3rdparty/dojox', lib: '.' },
        {
          name: "sumo",
          location: "sumo",
          main: "core/Main",
          lib: "."
        }
    ],

    paths: {
      views: "templates",
      ace : "3rdparty/ace/lib/ace",
      pilot: "3rdparty/pilot/lib/pilot"
    }
});
// map dojo/text! to text
define("text", ["dojo/text"], function(t){return t;});
require(["Main"]);

