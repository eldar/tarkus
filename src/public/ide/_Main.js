require({
  baseUrl: ".",
  // set the paths to our library packages
  packages: [
    {
      name: "dojo",
      location: "dojo-release-1.6.1-src/dojo",
      main: "lib/main-browser",
      lib: "."
    },
    {
      name: "dijit",
      location: "dojo-release-1.6.1-src/dijit",
      main: "lib/main",
      lib: "."
    }
  ],

  paths: {
    views: "templates",
    text: "3rdparty/requirejs/text",
    order: "3rdparty/requirejs/order",
    i18n: "3rdparty/requirejs/i18n",
    ace : "3rdparty/ace/lib/ace",
    pilot: "3rdparty/pilot/lib/pilot"
  }
}, ['ide/Main']);
