define [
  "dojo",
  "sumo/core/ModelBase",
  "core/Io",
  "plugins/project/Nodes"
], (dojo, Model, socketIo, nodes) ->

  Node = nodes.Node
  ROOT_NAME = "root-node"

  ProjectModel = dojo.declare Model.ModelBase,
    currentNode: null
    currentProject: null

    constructor: (openDocs) ->
      @_root = new Node(ROOT_NAME)
      @openDocs = openDocs
      dojo.connect this, "onChange", @openDocs, "handleNodeChange"

    root: -> @_root

    _newProject: (name) ->
      new Node(name, nodes.Type.Project, @root())

    creteNewProject: (name) ->
      node = @_newProject name
      @notifyChildrenChanged @root()
      socketIo.send "projectCreate", projectName: name
      node

    _openDir: (parent, dataNode) ->
      dataNode.dirs.sort (a, b) ->
        (if (a.name > b.name) then 1 else -1)

      (for dir in dataNode.dirs
        dirNode = new Node(dir.name, nodes.Type.Folder, parent)
        @_openDir dirNode, dir.content)

      dataNode.files.sort()
      (for file in dataNode.files
        new Node file, nodes.Type.File, parent)

    openProject: (name, onOpen) ->
      return  if @projectByName name
      socketIo.request "projectOpen",
        projectName: name
      , (e) =>
        project = @_newProject(name)
        @_openDir project, e.data
        @notifyChildrenChanged @root()
        onOpen project  if onOpen

    projectByName: (name) -> @findFile @root(), name

    findFile: (parent, name) ->
      _.find parent.children, (node) -> node.name is name

    createNewNode: (name, parent, isFile) ->
      type = (if isFile then nodes.Type.File else nodes.Type.Folder)
      action = (if isFile then "fileCreate" else "folderCreate")
      @_createFilePath new Node(name, type, parent), action

    _createFilePath: (node, command) ->
      return  unless node
      @notifyChildrenChanged node.parent
      socketIo.send command, node.pathDefinition()
      node

    getNodeById: (id) ->
      @root().find (node) -> node.id is id

    openAndSelectDocument: (node) ->
      return  unless node.isDocument()

      select = => @openDocs.setCurrentDocumentByNode node
      unless @openDocs.docByNode node
        @openDocument node, -> select()
      else
        select()

    openDocument: (node, onOpen) ->
      if node.isDocument() and not @openDocs.docByNode node
        socketIo.request "requestFileContent", node.pathDefinition(), (e) =>
          @openDocs.open node, e.data
          onOpen()

    updateCurrentProject: (node) ->
      @currentProject = node.getProject()

    closeCurrentProject: (prompt) ->
      project = @currentProject
      return  unless project
      allDocs = []

      project.iterate (node) =>
        doc = @openDocs.docByNode(node)
        allDocs.push doc  if doc

      doClose = =>
        @openDocs.closeDocument doc for doc in allDocs
        project.setParent null
        @currentProject = null
        @notifyChildrenChanged @root()

      self = this
      unsavedDocs = _.filter allDocs, (doc) -> doc.isModified()
      if unsavedDocs.length > 0
        prompt (doc.name() for doc in unsavedDocs), (save, forSave) ->
          if save
            _.each unsavedDocs, (doc, i) ->
              self.openDocs.saveDocument doc  if forSave[i]
          doClose()
      else
        doClose()

    renameNode: (id, newName) ->
      node = @getNodeById id
      same = _.find node.parent.children, (child) -> child.name is newName and child isnt node

      return false  if same
      node.setName newName
      true

    setLabel: (node, label) ->
      msg = _.extend node.pathDefinition(),
        newPath: node.parent.pathDefinition().path + "/" + label

      socketIo.request "renamePath", msg, (e) ->
      
      # TODO check for any errors
      node.setName label
      @onChange node

    deleteNode: (node) ->
      @openDocs.closeDocument @openDocs.docByNode(node)
      socketIo.request "deletePath", node.pathDefinition(), (e) ->
      
      # TODO check for any errors
      parent = node.parent
      node.setParent null
      @notifyChildrenChanged parent
