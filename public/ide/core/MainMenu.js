define([
    "dojo",
    "dijit/MenuBar",
    "dijit/MenuBarItem",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/MenuSeparator",
    "dijit/PopupMenuItem",
    "dijit/form/Button",
    "ui/Action",
    "ide/core/MainArea",
    "ide/core/Actions"
], function (dojo, MenuBar, MenuBarItem, Menu, MenuItem, MenuSeparator, PopupMenuItem, Button,
             Action, mainArea, actions) {
             
    var menuBar = dijit.byId("menuBar");
    var fileMenu = dijit.byId("fileMenu");
    
    var fileNew = new Menu();
    fileNew.addChild(actions.file.newProject.makeMenuItem({label: "Project..."}));
    fileNew.addChild(actions.file.newFile.makeMenuItem({label: "File..."}));
    fileNew.addChild(actions.file.newFolder.makeMenuItem({label: "Folder"}));
    fileMenu.addChild(new PopupMenuItem({label: "New", popup: fileNew}));

    fileMenu.addChild(actions.file.openProject.makeMenuItem());
    fileMenu.addChild(actions.file.save.makeMenuItem({iconClass: "dijitEditorIcon dijitEditorIconSave"}));

    fileMenu.addChild(new MenuSeparator());
    fileMenu.addChild(actions.file.closeProject.makeMenuItem());
    
    var editMenu = dijit.byId("editMenu");
    editMenu.addChild(actions.edit.cut.makeMenuItem());
    editMenu.addChild(actions.edit.copy.makeMenuItem());
    editMenu.addChild(actions.edit.paste.makeMenuItem());
    
    var button = new dijit.form.Button({
        label: "Save",
        showLabel: false,
        iconClass: "dijitEditorIcon dijitEditorIconSave",
        style: {margin: "0px"},
        baseClass: "dijitToolButton"
    });
     
    menuBar.addChild(button);

    return {
        menuBar: menuBar
    };
});
