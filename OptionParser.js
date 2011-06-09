/** Command-line options parser (http://valeriu.palos.ro/1026/).
Copyright 2011 Valeriu Paloş (valeriu@palos.ro), Max Samukha. All rights reserved.
Liscense: GPL.

Expects the "schema" array with options definitions and produces the
"options" object and the "arguments" array, which will contain all
non-option arguments encountered (including the script name and such).

Syntax:
{
    stopOnArgument: false,    
    {
        short: "o",
        long: "option",
        attributes: "!:+",
        brief: "this is an option",
        callback: function(value) {}
    }
}

Schema properties:

{

Option properties:

short:
    Short option name.

long:
    Long option name.
    
attributes:
    ! - option is mandatory;
    : - option expects a parameter;
    + - option may be specified multiple times (repeatable).
brief:
    Brief option description.
    
callback:
    The function to be called if an option that matches this option definition
    is encountered. The this object will be this option definition. The function will
    be passed the option value as single argument.

Notes:
- Parser is case-sensitive.
- The '-h|--help' option is provided implicitly.
- Parsed options are placed as fields in the "options" object.
- Non-option arguments are placed in the "arguments" array.
- Options and their parameters must be separated by space.
- Either one of «short» or «long» must always be provided.
- The «callback» function is optional.
- Cumulated short options are supported (i.e. '-tv').
- If an error occurs, the process is halted and the help is shown.
- Repeatable options will be cumulated into arrays.
- The parser does *not* test for duplicate option definitions.

// Sample option definitions.
var schema = {
    stopOnArgument: false,
    definitions: [

        { short: 'f', long: 'file', attributes: '!:', brief: "Some file we really need.",
            callback: function(data) {
               console.log("Hello: " + data);
            } },
        { short: 't', long: 'test', attributes: '!', brief: 'I am needed also.' },
        { short: 'd', brief: 'Enable debug mode.' },
        { long: 'level', attributes: ':', brief: 'Debug level (values 0-4).' },
        { short: 'v', long: 'verbose', attributes: '+', brief: 'Verbosity levels (can be used repeatedly).' },
    ]
}
*/

var _ = require("./Global")._;

exports.parse = function(arguments, schema) {    
    var self = this;
    var defs = schema.definitions;
    
    self.printOptions = function() {
            _.each(defs, function(item) {
            var names = (item.short ? '-' + item.short + (item.long ? '|' : ''): ' ') +
                        (item.long ? '--' + item.long : '');
            var syntax = names + (item.attributes.indexOf(':') != -1 ? ' «value»' : '');
            syntax += syntax.length < 20 ? new Array(20 - syntax.length).join(' ') : '';
            console.log("\t" + (item.attributes.indexOf('!') != -1 ? '*' : ' ')
                             + (item.attributes.indexOf('+') != -1 ? '+' : ' ')
                             + syntax + "\t" + item.brief);
        });
        console.log("\n\t (* mandatory option)\n\t (+ repeatable option)\n");
    }
    

    try {
        var options = {};
        var tokens = [];
        var remainingArguments = [];
       
        // normalize definitions
        _.each(defs, function(item) {
            if (!item.attributes)
                item.attributes = '';
        });
        
        // tokenize
        _.each(arguments, function(item, index) {      
            if (item.charAt(0) == '-') {
                if (item.charAt(1) == '-') {
                    tokens.push({ string: '--', arg: index }
                        , { string: item.slice(2), index: index});
                } else {
                    var items = item.split('').join('-').split('').slice(1);
                    _.each(items, function(item) {
                        tokens.push({ string: item, index: index});                        
                    });
                }
            } else {
                tokens.push({string: item, index: index });
            }
        });        
        
        var token, argIndex = 0;
        while (token = tokens.shift()) {
            if (token.string == '-' || token.string == '--') {
                var prefix = token.string;                
                token = tokens.shift();
                                
                var name = token ? token.string : '';                
                var option = null;
                for (var i = 0; i < defs.length; i++) {                
                    var item = defs[i];
                    if (item.short == name || item.long == name) {
                        option = item;
                        break;
                    }
                }
                if (!option) {
                    if (name == 'help' || name == 'h')
                        throw 'help';
                    throw "Unknown option '" + prefix + name + "'";
                }
                var value = true;
                if ((option.attributes.indexOf(':') != -1)) {
                    token = tokens.shift();
                    if (!token)
                        throw "Option '" + prefix + name + "' expects a parameter";
                    value = token.string;
                }
                var index = option.name || option.long || option.short;
                if (option.attributes.indexOf('+') != -1) {
                    options[index] = _.isArray(options[index]) ? options[index] : [];
                    options[index].push(value);
                } else {
                    options[index] = value;
                }
                if (option.callback) {
                    option.callback(self);
                }
                option.attributes = option.attributes.replace('!', '');

            } else {                
                if (schema.stopOnArgument == argIndex) {
                    console.log("inserting remaining: ", remainingArguments);
                    _.insert(remainingArguments, arguments.slice(token.index, arguments.length));
                    break;
                } else {
                    remainingArguments.push(token.string); 
                    argIndex++;
                }
            }
        }
        _.each(defs, function(item) {
            if (item.attributes.indexOf('!') != -1) {
                throw "Option '" + (item.long ? '--' + item.long : '-' + item.short) +
                      "' is mandatory and was not given";
            }
        });
                
        console.log("remaining ", remainingArguments);
        arguments.length = 0;
        _.insert(arguments, remainingArguments);
        return options;

    } catch(e) {
        if (e == 'help') {
            console.log("Usage: script [options|arguments]");
            console.log("Options:");
            self.printOptions();
        }
        console.error(e);
        console.error("Use the '-h|--help' option for usage details.");
        process.exit(1);
    }
}
