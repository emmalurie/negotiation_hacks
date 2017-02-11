/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var fsThen = require('..'),
	fs = require('fs'),
	buster = require('buster'),
    assert, refute, fail, whitelist;

assert = buster.assertions.assert;
refute = buster.assertions.refute;
fail = buster.assertions.fail;

whitelist = require('../lib/method-whitelist.json');

function onWhiteList(name) {
	return whitelist.indexOf(name) >= 0;
}

buster.testCase('fs-then/method-whitelist', {
	'should wrap methods on the whitelist': function () {
		Object.keys(fs).forEach(function (prop) {
			if (onWhiteList(prop)) {
				refute.same(fs[prop], fsThen[prop]);
			}
		});
	},
	'should not alter methods not on the whitelist': function () {
		Object.keys(fs).forEach(function (prop) {
			if (!onWhiteList(prop)) {
				assert.same(fs[prop], fsThen[prop]);
			}
		});
	}
});
