/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var nodeThen = require('..'),
    buster = require('buster'),
    raw, assert, refute, fail;

assert = buster.assertions.assert;
refute = buster.assertions.refute;
fail = buster.assertions.fail;

function Fixture() {}
Fixture.prototype = {
	yay: function () {},
	nay: function () {},
	value: true
};
raw = new Fixture();

buster.testCase('node-then#wrapObject', {
	'should wrap all functions by default': function () {
		var wrapped = nodeThen.wrapObject(raw);
		refute.same(raw.yay, wrapped.yay);
		refute.same(raw.nay, wrapped.nay);
		assert.same(raw.value, wrapped.value);
	},
	'should wrap only eligible properties': function () {
		var wrapped = nodeThen.wrapObject(raw, function (name /*, func */) {
			return name === 'yay';
		});
		refute.same(raw.yay, wrapped.yay);
		assert.same(raw.nay, wrapped.nay);
		assert.same(raw.value, wrapped.value);
	},
	'wrapped objects should have the same prototype as source': function () {
		var rawProto = Object.getPrototypeOf(raw),
		    wrappedProto = Object.getPrototypeOf(nodeThen.wrapObject(raw));
		assert.same(rawProto, wrappedProto);
	}
});
