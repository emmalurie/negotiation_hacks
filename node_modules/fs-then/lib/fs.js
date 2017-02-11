/*
 * Copyright 2013 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var fs, nodeThen, whitelist;

fs = require('fs');
nodeThen = require('node-then');
whitelist = require('./method-whitelist.json');

module.exports = nodeThen.wrapObject(fs, function eligible(name, obj) {
	return typeof obj === 'function' && whitelist.indexOf(name) >= 0;
});
