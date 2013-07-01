Checkpoint.js
========

Checkpoint.js is just a pretty output for `nodeunit` package.

Install via npm
```
	npm install checkpoint
```

Install from github:
```
	git clone https://github.com/rumkin/checkpoint.git
	cd checkpoint
	npm install
```

Local install:
```
	ln -s node_modules/js-tests/bin/checkpoint checkpoint
```

Global install:
```
	sudo ln -s node_modules/js-tests/bin/checkpoint /usr/bin/checkpoint
```

### Usage:

Create test file `hello.js` inside `tests` directory. This file should looks like a simple node.js package:

```javascript
	module.exports = {
		'hello test' : function(test) {
			test.ok(true, 'True looks to be true');
			test.done();
		}
	}
```

Then run tests typing shell command:
```
	checkpoint tests/*.js
```
