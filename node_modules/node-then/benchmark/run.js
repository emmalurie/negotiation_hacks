/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var Benchmark = require('benchmark');
var nodeThen = require('..');


// work functions

var work = function (callback) {
	process.nextTick(function () {
		callback(undefined, true);
	});
};
var workthen = nodeThen.wrapFunction(work);


// utils

function toMS(seconds, precision) {
	precision = precision || 0;
	return Math.round(seconds * Math.pow(10, precision + 3)) / Math.pow(10, precision);
}

function median(source) {
	var data, middle;
	data = Array.prototype.slice.call(source);
	data.sort();
	middle = data.length / 2;
	if (middle === Math.floor(middle)) {
		return data[middle];
	}
	else {
		middle = Math.floor(middle);
		return (data[middle] + data[middle + 1]) / 2;
	}
}


new Benchmark.Suite()

// add tests

.add('native callback', function (deferred) {
	work(function (err, value) {
		if (err) {
			return;
		}
		deferred.resolve(value);
	});
}, { defer: true })

.add('promised callback', function (deferred) {
	workthen(function (err, value) {
		if (err) {
			return;
		}
		deferred.resolve(value);
	});
}, { defer: true })

.add('promised promise', function (deferred) {
	workthen().then(function (value) {
		deferred.resolve(value);
	});
}, { defer: true })

// add listeners
.on('cycle', function (event) {
	console.log(String(event.target));
})
.on('complete', function () {
	var fastest = this.filter('fastest')[0];
	console.log();
	this.forEach(function (test) {
		if (fastest === test) {
			return;
		}
		console.log(test.name + ' is ' + toMS(median(test.stats.sample) - median(fastest.stats.sample), 3) + ' ms slower than ' + fastest.name);
	});
})
.on('error', function (e) {
	console.error('Error:', e);
})

// run async
.run();
