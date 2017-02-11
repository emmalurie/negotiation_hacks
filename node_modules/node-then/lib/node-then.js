/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var nodefn, when;

nodefn = require('when/node/function');
when = require('when');

function defaultEligible(name, property) {
	return property instanceof Function;
}

/**
 * Wraps a function augmenting the callback, if any, to convert to a promise.
 *
 * The returned function wraps the provided function which returns a promise
 * representing the callback value, or error, an invocation of the orginal
 * method would receive. The wrapped function optionally accepts a callback
 * function as the last argument, allowing for a drop in replacement.
 * Arguments to the wrapped function may be promises.
 *
 * @param {Function} func the function to wrap
 * @param {*} [context] the 'this' context to invoke the function with
 * @returns a promise: resovled with the callback's value or rejected with the
 *   callback's error
 */
function wrapFunction(func, context) {
	return function () {
		return when.all(arguments).then(function (args) {
			var callback, promise;
			if (args[args.length - 1] instanceof Function) {
				callback = args.pop();
			}
			promise = when.promise(function (resolve, reject) {
				args.push(function (err, value) {
					if (err) {
						reject(err);
					}
					else {
						resolve(value);
					}
				});
				func.apply(context, args);
			});
			if (callback) {
				nodefn.bindCallback(promise, callback);
			}
			return promise;
		});
	};
}

/**
 * Wraps methods on an object that pass the eligibity test.
 *
 * @param {*} obj object whose methods use Node style callbacks
 * @param {Function} [eligible] function to test if a particular method should
 *   be wrapped
 * @returns {*} the original object with eligible methods wrapped
 */
function wrapObject(obj, eligible) {
	var wrapped, name;
	wrapped = Object.create(Object.getPrototypeOf(obj));
	eligible = eligible || defaultEligible;
	for (name in obj) {
		if (eligible(name, obj[name])) {
			wrapped[name] = wrapFunction(obj[name], obj);
		}
		else {
			wrapped[name] = obj[name];
		}
	}
	return wrapped;
}

module.exports = {
	wrapFunction: wrapFunction,
	wrapObject: wrapObject
};
