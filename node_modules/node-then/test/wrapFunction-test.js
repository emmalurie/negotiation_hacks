/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var nodeThen = require('..'),
    buster = require('buster'),
    when = require('when'),
    asyncMethod,
    assert, refute, fail;

assert = buster.assertions.assert;
refute = buster.assertions.refute;
fail = buster.assertions.fail;

asyncMethod = nodeThen.wrapFunction(function (isError, callback) {
	process.nextTick(function () {
		if (isError) {
			callback(true);
		}
		else {
			callback(undefined, true);
		}
	});
});

buster.testCase('node-then#wrapFunction', {
	'given a invocation with a callback': {
		'it should fire the callback with a sucessful value': function (done) {
			var promise = asyncMethod(false, function (err, value) {
				assert(value);
				refute(err);
				done();
			});
			assert.isFunction(promise.then);
		},
		'it should fire the callback with an error': function (done) {
			var promise = asyncMethod(true, function (err, value) {
				refute(value);
				assert(err);
				done();
			});
			assert.isFunction(promise.then);
		}
	},
	'given a invocation without a callback': {
		'it should resolve the returned promise with a value': function () {
			return asyncMethod(false).then(
				function (value) {
					assert(value);
				},
				fail
			);
		},
		'it should reject the returned promise with an error': function () {
			return asyncMethod(true).then(
				fail,
				function (err) {
					assert(err);
				}
			);
		}
	},
	'should handle promises for arguments': function () {
		return asyncMethod(when(false)).then(
			function (value) {
				assert(value);
			},
			fail
		);
	}
});
