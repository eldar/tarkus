define([
    "dojo",
    "dijit/form/Button",
], function (dojo, Button) {

    return dojo.declare("ui.ToolButton", Button, {
        showLabel: false,
        style: {margin: "0px"},
        baseClass: "dijitToolButton"
    });
});
