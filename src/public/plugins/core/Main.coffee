define ["plugins/core/MainArea", "plugins/core/MainMenu", "plugins/core/Actions"], (mainArea, mainMenu, actions) ->
  ide = require("core/Ide")
  init: ->
    mainArea.init()
    actions.init()
    mainMenu.init()
