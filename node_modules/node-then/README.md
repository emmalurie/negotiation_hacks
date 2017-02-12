node-then
=========

[![Build Status](https://travis-ci.org/node-then/node-then.png)](https://travis-ci.org/node-then/node-then)

Thin wrapper arround Node.js modules that makes the async functions promise
aware. The wrapped methods return a promise the represents the value of the
async operation. Traditional callbacks still work, allowing for a transparent
drop-in.


Usage
-----

Wrap a single function
```javascript
var nodeThen, fs, readFileThen;

nodeThen = require('node-then');
fs = require('fs');

readFileThen = nodeThen.wrapFunction(fs.readFile, fs);

readFileThen('path/to/file').then(function (fileConent) { ... });
```

Wrap an object
```javascript
var nodeThen, fs, fsThen;

nodeThen = require('node-then');
fs = require('fs');

fsThen = nodeThen.wrapObject(fs, function isEligible(name, prop) {
	return typeof prop === 'function';
});

fsThen.readFile('path/to/file').then(function (fileConent) { ... });
```


Test Suite
----------

Our test suite uses Buster.js for correctness and Benchmark.js for performance.

Running the correctness tests:
    $ npm test

Running the performance tests:
    $ npm run-script benchmark


Performance Impact
------------------

Wrapping a callback with a promise will be slower than the native callbacks.
The question should be how much slower vs what benefit. Ultimatly, it's up to
each developer to decide if the cost/benefit is worthwhile.

```
native callback x 749 ops/sec ±0.37% (24 runs sampled)
promised callback x 697 ops/sec ±0.59% (87 runs sampled)
promised promise x 710 ops/sec ±0.59% (75 runs sampled)

promised callback is 0.084 ms slower than native callback
promised promise is 0.069 ms slower than native callback
```


Change Log
----------

v0.1.0
- first release
