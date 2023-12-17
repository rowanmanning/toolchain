'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/plugin', () => {
	let module;

	before(() => {
		td.reset();

		td.replace('../../lib/load-plugins', {loadPlugins: 'mockLoadPlugins'});
		td.replace('../../lib/plugin', {Plugin: 'mockPlugin'});
		td.replace('../../lib/plugin-set', {PluginSet: 'mockPluginSet'});

		module = require('../..');
	});

	describe('.loadPlugins', () => {
		it('aliases @rmtc/plugin/lib/load-plugins', () => {
			assert.equal(module.loadPlugins, 'mockLoadPlugins');
		});
	});

	describe('.Plugin', () => {
		it('aliases @rmtc/plugin/lib/plugin', () => {
			assert.equal(module.Plugin, 'mockPlugin');
		});
	});

	describe('.PluginSet', () => {
		it('aliases @rmtc/plugin/lib/plugin-set', () => {
			assert.equal(module.PluginSet, 'mockPluginSet');
		});
	});
});
