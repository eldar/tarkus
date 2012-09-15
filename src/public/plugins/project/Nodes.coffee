define ["dojo", "sumo"], (dojo, sumo) ->
  Type =
    Folder: 1
    Project: 2
    File: 3

  getFileExt = (name) ->
    parts = name.split "."
    if parts.length is 1
      ""
    else
      parts[parts.length - 1]

  stripNodePath = (fullPath) ->
    # splitting path into project name and relative path
    i = fullPath.indexOf "/"
    project: fullPath.substr 0, i
    path: fullPath.substr i + 1

  NodeImpl = dojo.declare(null,
    constructor: (name, type, parent) ->
      @type = type
      @setParent parent
      @children = []
      sumo.makeUnique this, "pn_"
      @id = _.uniqueId "project_node_"
      @setName name

    isFolder: ->
      (@type is Type.Folder) or (@type is Type.Project)

    setName: (nm) ->
      @name = nm
      if @isFolder()
        @docType = "folder"
        return
      ext = getFileExt(nm)
      switch ext
        when "js", "css", "html", "coffee"
          dType = ext
        else
          dType = "unknown"
      @docType = dType

    isDocument: -> @type is Type.File

    setParent: (parent) ->
      if @parent
        return  if parent is @parent
        siblings = @parent.children
        idx = _.indexOf siblings, this
        siblings.splice idx, 1  unless idx is -1
      parent.children.push this  if parent
      @parent = parent or null

    iterate: (callback) ->
      iterImpl = (node, pred) ->
        callback node
        iterImpl child, pred for child in node.children

      iterImpl this, callback

    find: (pred) ->
      findImpl = (node, pred) ->
        return node  if pred(node)
        (for child in node.children
          res = findImpl child, pred
          return res if res?)
        null

      findImpl this, pred

    fullPath: ->
      node = this
      result = ""
      while node
        result = node.name + "/" + result
        node = node.parent
      
      # strip of root node
      i = result.indexOf "/"
      result = result.substr i + 1
      
      # trim forward slashes
      result.replace /^\/+|\/+$/g, ""

    fullObjectPath: ->
      result = []
      node = this
      while node
        result.unshift node
        node = node.parent
      result

    getProject: ->
      node = this
      node = node.parent  while node.parent.parent
      node

    pathDefinition: ->
      stripped = stripNodePath(@fullPath())
      projectName: stripped.project
      path: stripped.path
  )
  Type: Type
  Node: NodeImpl
