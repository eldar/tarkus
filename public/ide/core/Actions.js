define(["ui/Action"], function (Action) {
    return {
        file : {
            newProject: new Action({ label: "New Project..." }),
            newFile: new Action({ label: "New File..." }),
            newFolder: new Action({ label: "New Folder..." }),
            openProject: new Action({ label: "Open Project..." }),
            save: new Action({ label: "Save", iconClass: "dijitEditorIcon dijitEditorIconSave", disabled: true }),
            closeProject: new Action({ label: "Close Project", disabled: true }),
        },
        edit: {
            cut: new Action({ label: "Cut" }),
            copy: new Action({ label: "Copy" }),
            paste: new Action({ label: "Paste" }),
        }
    };
});
