# Very stupid middleware to serve compiled coffee files
# to the client

fs = require "fs"
coffee = require "coffee-script"

stripExt = (filePath) ->
  if (lastDotIndex = filePath.lastIndexOf '.') >= 0
    filePath[0...lastDotIndex]
  else
    filePath

endsWith = (str, suffix) ->
    str.indexOf(suffix, str.length - suffix.length) != -1

module.exports = (options = {}) ->

    options.src ?= "public"

    (req, res, next) ->
        fileName = options.src + "/" + req.url
        if not endsWith fileName, ".js"
            next()
            return
  
        if fs.existsSync(fileName)
            jsStats = fs.statSync(fileName)
  
        csFileName = stripExt(fileName) + ".coffee"
        if fs.existsSync(csFileName)
            csStats = fs.statSync(csFileName)

        if csStats
            res.end coffee.compile fs.readFileSync(csFileName, 'utf8')
        else
            next()
