/*
 * Dependencies
 */

var path   = require('path');
var format = require('util').format;
var _      = require('blank-js');

var red, blue, green, bold, reset;
red   = '\033[31m';
green = '\033[32m';
blue  = '\033[34m';
bold  = '\033[1m';
reset = '\033[0m';

var styles = {
	red   : '\033[31m',
	green : '\033[32m',
	blue  : '\033[34m',
	bold  : '\033[1m',
	reset : '\033[0m',
};

function stylize(message) {
	return (message + '').replace(/\[([a-z]+)\]/g, function(v, name){
		if (styles.hasOwnProperty(name)) {
			return styles[name];
		} else {
			return v;
		}
	});
}

function getStackLine(stack, search) {
	var index, length, line, file;
	index  = -1;
	length = stack.length;

	while(++index < length) {
		line = stack[index];
		file = line.getFileName();

		if (file.substr(-search.length) === search) {
			return search + '@' + line.getLineNumber() + ':' + line.getColumnNumber()
		}
	}

	return '';
}

Error.prepareStackTrace = function(error, structuredStackTrace) {
	structuredStackTrace.toString = function() {
		var result, length, index, trace, line, filename, dir;

		// result = error.message + '\n';
		result = [];
		index  = -1;
		length = this.length;
		dir    = process.cwd();
		
		while (++index < length) {
			trace = this[index];
			line = format(stylize('\t[bold]%s[reset] at %s:%s:%s'),
				_.pad(trace.getMethodName() || trace.getFunctionName(), 35, ' '),
				trace.getFileName().replace(dir, '.'),
				trace.getLineNumber(),
				trace.getColumnNumber()
			);
			result.push(line);
		}

		return result.join('\n');
	};

	return structuredStackTrace;
}

var messages = {
	moduleStart  : '[bold]%s[reset]',
	testDone     : '  [bold]%s[reset]',
	assertPassed : '    [bold]✔[reset] %s', 
	assertFailed : '    [bold][red]✖ %s[reset]', 
	testFailed   : '    [bold][red]FAILURES[reset]: %s/%s (%s s)\n',
	testPassed   : '    [bold][green]PASSED[reset]: %s (%s s)\n',
	suitFailed   : '[bold][red]FAILURES[reset]: %s/%s (%s s)'
};

for (var name in messages) messages[name] = stylize(messages[name]);

module.exports.info = 'Clear reporter';

module.exports.run = function(files, options) {
	var nodeunit = require('nodeunit');
	files = files.map(function(file) {
		if (file.charAt(0) !== '/') {
			file = path.join(process.cwd(), file);
		}

		return file;
	});

	nodeunit.runFiles(files, this.create(options));
}

module.exports.create = function(options) {
	var current;
	
	return {
		moduleStart : function(name) {
			current = name;
			console.log(messages.moduleStart, name);
		},

		testDone : function(name, assertions) {
			var assert, total, passed, tests, line, message;

			tests = [].concat(assertions);

			console.log(messages.testDone, name);
			total  = assertions.length;
			passed = 0;

			while (tests.length) {
				assert = tests.shift();
				if (assert.passed()) {
					passed++;
					console.log(messages.assertPassed, assert.message);
				} else {
					message = messages.assertFailed;

					if (options.errors === 'short') {
						message += ' ' + getStackLine(assert.error.stack, current);
					} else if (options.errors === 'full') {
						message += '\n    ' + assert.error.stack;
					}

					console.error(message, assert.message);
				}
			}
			
			console.log();

			if (passed !== total) {
				console.log(messages.testFailed, total - passed, total, (assertions.duration / 1000).toFixed(4));
			} else {
				console.log(messages.testPassed, total, (assertions.duration / 1000).toFixed(4));
			}
		},
		done : function(assertions){
			if (assertions.failures()) {
				console.log(messages.suitFailed, assertions.failures(), assertions.length, (assertions.duration / 1000).toFixed(4));
			}
		}
	};
};