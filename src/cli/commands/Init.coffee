optParser = require "OptionParser"
environment = require "Environment"

exports = module.exports = (app) ->

    schema =
        definitions: [
            short: "h", long: "help", brief: "Print this help", callback: (parser) ->
                console.log "Initializes a #{app.name} environment in the specified directory or in the home directory of the " +
                            "specified user"
                console.log "Options:"
                parser.printOptions()
                process.exit 0
        ]
    
    options = optParser.parse(app.arguments, schema)
    env = environment.load(dir: "test-env", create: yes, callback: (err)->
        console.log err        
    )
    
    console.log options
    
    
