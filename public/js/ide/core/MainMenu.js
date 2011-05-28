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
    fileMenu.addChild(actions.file.save.makeMenuItem());
    fileMenu.addChild(new MenuSeparator());
    fileMenu.addChild(actions.file.closeProject.makeMenuItem());
    
    var editMenu = dijit.byId("editMenu");
    editMenu.addChild(actions.edit.cut.makeMenuItem());
    editMenu.addChild(actions.edit.copy.makeMenuItem());
    editMenu.addChild(actions.edit.paste.makeMenuItem());
    


    dojo.connect(actions.file.newProject, "triggered", function() {
//        fileNew.set("label", "Open file");
//        fileNew.set("disabled", true);
    });
/*
        var pMenuBar = new MenuBar({});

        var fileMenu = new Menu({});
        fileMenu.addChild(new MenuItem({ label: "New" }));
        fileMenu.addChild(new MenuItem({ label: "Open Project..." }));
        fileMenu.addChild(new MenuItem({ label: "Save" }));
        fileMenu.addChild(new dijit.MenuSeparator());
        fileMenu.addChild(new MenuItem({ label: "Close Project" }));
        pMenuBar.addChild(new PopupMenuBarItem({
            label: "File",
            popup: fileMenu
        }));

        var editMenu = new Menu({});
        editMenu.addChild(new MenuItem({ label: "Cut" }));
        editMenu.addChild(new MenuItem({ label: "Copy" }));
        editMenu.addChild(new MenuItem({ label: "Paste" }));
        pMenuBar.addChild(new PopupMenuBarItem({
            label: "Edit",
            popup: editMenu
        }));fileNew.makeMenuItem()

        pMenuBar.placeAt(mainArea.top.domNode);
        pMenuBar.startup();

    return {
        menuBar: pMenuBar
    };
    */
});
