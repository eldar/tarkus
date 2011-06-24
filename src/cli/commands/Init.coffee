optParser = require "OptionParser"


exports = module.exports = (app) ->

    schema =   
        definitions: [
            short: "h", long: "help", brief: "Print this help", callback: (parser) ->
                console.log "Initializes a #{app.name} environment in the specified directory or in the home directory of the
 specified user"
                console.log "Options:"
                parser.printOptions()
                process.exit 0
        ]
    
    options = optParser.parse(app.arguments, schema)
    console.log options
