var deps = [
    "dojo",
    "dijit/MenuBar",
    "dijit/PopupMenuBarItem",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/MenuSeparator",
    "dijit/PopupMenuItem",
    "ui/Action",
    "ide/core/MainArea",
    "ide/core/Actions"
];

define(deps, function (dojo, MenuBar, PopupMenuBarItem, Menu, MenuItem, MenuSeparator, PopupMenuItem, Action, mainArea, actions) {
    var fileMenu = dijit.byId("fileMenu");
    
    var fileNew = new Menu();
    fileNew.addChild(actions.file.newProject.makeMenuItem());
    fileNew.addChild(actions.file.newFile.makeMenuItem());
    fileNew.addChild(actions.file.newFolder.makeMenuItem());
    fileMenu.addChild(new PopupMenuItem({label: "New", popup: fileNew}));

    fileMenu.addChild(actions.file.openProject.makeMenuItem());
    fileMenu.addChild(actions.file.save.makeMenuItem());

    fileMenu.addChild(new MenuSeparator());
    fileMenu.addChild(actions.file.closeProject.makeMenuItem());
    
    var editMenu = dijit.byId("editMenu");
    editMenu.addChild(actions.edit.cut.makeMenuItem());
    editMenu.addChild(actions.edit.copy.makeMenuItem());
    editMenu.addChild(actions.edit.paste.makeMenuItem());

    return {
        menuBar: dijit.byId()
    };
});
