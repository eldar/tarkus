try {
    var tokens = [];
    var options = {};
    var arguments = [];
    for (var i = 0, item = process.argv[0]; i < process.argv.length; i++, item = process.argv[i]) {
        if (item.charAt(0) == '-') {
            if (item.charAt(1) == '-') {
                tokens.push('--', item.slice(2));
            } else {
                tokens = tokens.concat(item.split('').join('-').split('').slice(1));
            }
        } else {
            tokens.push(item);
        }
    }
    while (type = tokens.shift()) {
        if (type == '-' || type == '--') {
            var name = tokens.shift();
            if (name == 'help' || name == 'h') {
                throw 'help';
                continue;
            }
            var option = null;
            for (var i = 0, item = schema[0]; i < schema.length; i++, item = schema[i]) {
                if (item[type.length - 1] == name) {
                    option = item;
                    break;
                }
            }
            if (!option) {
                throw "Unknown option '" + type + name + "' encountered!";
            }
            var value = true;
            if ((option[2].indexOf(':') != -1) && !(value = tokens.shift())) {
                throw "Option '" + type + name + "' expects a parameter!";
            }
            var index = option[1] || option[0];
            if (option[2].indexOf('+') != -1) {
                options[index] = options[index] instanceof Array ? options[index] : [];
                options[index].push(value);
            } else {
                options[index] = value;
            }
            if (typeof(option[4]) == 'function') {
                option[4](value);
            }
            option[2] = option[2].replace('!', '');
        } else {
            arguments.push(type);
            continue;
        }
    }
    for (var i = 0, item = schema[0]; i < schema.length; i++, item = schema[i]) {
        if (item[2].indexOf('!') != -1) {
            throw "Option '" + (item[1] ? '--' + item[1] : '-' + item[0]) +
                  "' is mandatory and was not given!";
        }
    }
} catch(e) {
    if (e == 'help') {
        console.log("Usage: ./«script» «options» «values»\n");
        console.log("Options:");
        for (var i = 0, item = schema[0]; i < schema.length; i++, item = schema[i]) {
            var names = (item[0] ? '-' + item[0] + (item[1] ? '|' : ''): ' ') +
                        (item[1] ? '--' + item[1] : '');
            var syntax = names + (item[2].indexOf(':') != -1 ? ' «value»' : '');
            syntax += syntax.length < 20 ? new Array(20 - syntax.length).join(' ') : '';
            console.log("\t" + (item[2].indexOf('!') != -1 ? '*' : ' ')
                             + (item[2].indexOf('+') != -1 ? '+' : ' ')
                             + syntax + "\t" + item[3]);
        }
        console.log("\n\t (* mandatory option)\n\t (+ repeatable option)\n");
        process.exit(0);
    }
    console.error(e);
    console.error("Use the '-h|--help' option for usage details.");
    process.exit(1);
}

exports = module.exports = options;
