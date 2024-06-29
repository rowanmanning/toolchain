'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const td = require('testdouble');

describe('@rmtc/plugin/lib/load-plugins', () => {
	let directoryPath;
	let loadPlugins;
	let Logger;
	let mockConfig;
	let MockPlugin1;
	let MockPlugin2;
	let mockProject;
	let PluginSet;
	let ToolchainError;

	before(() => {
		td.reset();

		Logger = td.replace('@rmtc/logger').Logger;
		PluginSet = td.replace('../../../lib/plugin-set').PluginSet;
		ToolchainError = td.replace('@rmtc/errors').ToolchainError;

		MockPlugin1 = td.replace('../fixtures/plugins/plugin-1').Plugin;
		MockPlugin2 = td.replace('../fixtures/plugins/plugin-2').Plugin;

		directoryPath = path.resolve(__dirname, '..', 'fixtures', 'plugins');

		mockConfig = {
			plugins: [
				{
					path: './plugin-1',
					config: {
						mockPluginConfig1: true
					}
				},
				{
					path: './plugin-2',
					config: {
						mockPluginConfig2: true
					}
				}
			]
		};

		mockProject = {
			directoryPath
		};

		loadPlugins = require('../../../lib/load-plugins').loadPlugins;
	});

	describe('.loadPlugins(config, project)', () => {
		let returnValue;

		before(() => {
			returnValue = loadPlugins(mockConfig, mockProject);
		});

		it('creates and returns a plugin set', () => {
			td.verify(new PluginSet(), { times: 1 });
			assert.ok(returnValue instanceof PluginSet);
		});

		it('instantiates a prefixed logger for each plugin', () => {
			// Annoyingly testdouble loses the name of classes, so we just
			// verify that two loggers were created
			td.verify(new Logger({ prefix: '[testDouble]' }), { times: 2 });
		});

		it('instantiates each found plugin with all the data it needs', () => {
			const pluginSet = td.explain(PluginSet).calls[0].context;
			const loggers = td.explain(Logger).calls.map((call) => call.context);
			td.verify(
				new MockPlugin1({
					config: { mockPluginConfig1: true },
					project: mockProject,
					logger: loggers[0],
					pluginSet
				}),
				{ times: 1 }
			);
			td.verify(
				new MockPlugin2({
					config: { mockPluginConfig2: true },
					project: mockProject,
					logger: loggers[1],
					pluginSet
				}),
				{ times: 1 }
			);
		});

		it('adds each plugin instance to the set', () => {
			const pluginSet = td.explain(PluginSet).calls[0].context;
			td.verify(pluginSet.addPlugin(td.matchers.isA(MockPlugin1)), { times: 1 });
			td.verify(pluginSet.addPlugin(td.matchers.isA(MockPlugin2)), { times: 1 });
		});

		describe('when the loaded plugin does not have a Plugin export', () => {
			it('throws a plugin invalid error', () => {
				try {
					loadPlugins(
						{
							plugins: [
								{
									path: './no-export-plugin'
								}
							]
						},
						mockProject
					);
				} catch (error) {
					assert.ok(error instanceof ToolchainError);
					td.verify(
						new ToolchainError(td.matchers.isA(String), {
							code: 'PLUGIN_INVALID'
						})
					);
				}
			});
		});

		describe('when the loaded plugin Plugin export is not an instance of Plugin', () => {
			it('throws a plugin invalid error', () => {
				try {
					loadPlugins(
						{
							plugins: [
								{
									path: './non-plugin-export-plugin'
								}
							]
						},
						mockProject
					);
				} catch (error) {
					assert.ok(error instanceof ToolchainError);
					td.verify(
						new ToolchainError(td.matchers.isA(String), {
							code: 'PLUGIN_INVALID'
						})
					);
				}
			});
		});

		describe('when loading a plugin fails', () => {
			it('throws a plugin missing error', () => {
				try {
					loadPlugins(
						{
							plugins: [
								{
									path: './non-plugin'
								}
							]
						},
						mockProject
					);
				} catch (error) {
					assert.ok(error instanceof ToolchainError);
					td.verify(
						new ToolchainError(td.matchers.isA(String), {
							code: 'PLUGIN_MISSING',
							cause: td.matchers.isA(Error)
						})
					);
				}
			});
		});

		describe('when the loaded plugin is not valid JavaScript', () => {
			it('throws a plugin invalid error', () => {
				try {
					loadPlugins(
						{
							plugins: [
								{
									path: './invalid-js-plugin'
								}
							]
						},
						mockProject
					);
				} catch (error) {
					assert.ok(error instanceof ToolchainError);
					td.verify(
						new ToolchainError(td.matchers.isA(String), {
							code: 'PLUGIN_INVALID_JAVASCRIPT',
							cause: td.matchers.isA(Error)
						})
					);
				}
			});
		});

		describe('when a general error occurs', () => {
			let mockError;

			before(() => {
				mockError = new Error('mock error');
				td.when(new MockPlugin1(), { ignoreExtraArgs: true }).thenThrow(mockError);
			});

			it('rethrows the error', () => {
				assert.throws(() => loadPlugins(mockConfig, mockProject), mockError);
			});
		});
	});
});
