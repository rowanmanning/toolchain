'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/plugin/lib/plugin-set', () => {
	let ConfigError;
	let mockStep;
	let PluginSet;

	before(() => {
		td.reset();

		ConfigError = td.replace('@rmtc/config').ConfigError;

		mockStep = {
			name: 'mock-step',
			plugin: {
				constructor: {name: 'MockPlugin'}
			},
			executor: 'mock-executor'
		};

		PluginSet = require('../../../lib/plugin-set').PluginSet;
	});

	describe('.PluginSet', () => {
		it('is a class constructor', () => {
			assert.equal(typeof PluginSet, 'function');
			assert.equal(typeof PluginSet.prototype.constructor, 'function');
		});

		describe('new PluginSet()', () => {
			let pluginSet;

			before(() => {
				pluginSet = new PluginSet();
			});

			describe('.plugins', () => {
				it('is an empty array', () => {
					assert.deepEqual(pluginSet.plugins, []);
				});

				it('is read-only', () => {
					assert.throws(() => {
						pluginSet.plugins = 'nope';
					}, /cannot set property plugins/i);
				});
			});

			describe('.workflows', () => {
				it('is an empty array', () => {
					assert.deepEqual(pluginSet.workflows, []);
				});

				it('is read-only', () => {
					assert.throws(() => {
						pluginSet.workflows = 'nope';
					}, /cannot set property workflows/i);
				});
			});

			describe('.steps', () => {
				it('is an empty array', () => {
					assert.deepEqual(pluginSet.steps, []);
				});

				it('is read-only', () => {
					assert.throws(() => {
						pluginSet.steps = 'nope';
					}, /cannot set property steps/i);
				});
			});

			describe('.getWorkflowSteps(name)', () => {
				it('returns an empty array', () => {
					assert.deepEqual(pluginSet.getWorkflowSteps('non-workflow'), []);
				});
			});

			describe('.addPlugin(plugin)', () => {
				it('adds a plugin to the set', () => {
					pluginSet = new PluginSet();
					pluginSet.addPlugin({
						constructor: {name: 'MockPlugin'}
					});
					assert.deepEqual(pluginSet.plugins, [
						{constructor: {name: 'MockPlugin'}}
					]);
				});
			});

			describe('.initPlugins()', () => {
				it('initialises each plugin in the set and returns the plugin set', () => {
					const mockPlugin1 = {init: td.func()};
					const mockPlugin2 = {init: td.func()};

					pluginSet = new PluginSet();
					pluginSet.addPlugin(mockPlugin1);
					pluginSet.addPlugin(mockPlugin2);

					const returnValue = pluginSet.initPlugins();
					assert.equal(returnValue, pluginSet);
					td.verify(mockPlugin1.init(), {times: 1});
					td.verify(mockPlugin2.init(), {times: 1});
				});
			});

			describe('.defineWorkflow(name)', () => {
				before(() => {
					pluginSet = new PluginSet();
				});

				it('adds a workflow to the set', () => {
					pluginSet.defineWorkflow('mock-workflow');
					assert.deepEqual(pluginSet.workflows, ['mock-workflow']);
				});

				describe('when a workflow with the same name has already been defined', () => {
					it('does not add it more than once', () => {
						pluginSet.defineWorkflow('mock-workflow');
						pluginSet.defineWorkflow('mock-workflow');
						assert.deepEqual(pluginSet.workflows, ['mock-workflow']);
					});
				});
			});

			describe('.defineWorkflow(name, defaultSteps)', () => {
				it('adds a workflow to the set alonside some steps', () => {
					pluginSet = new PluginSet();
					pluginSet.defineWorkflow('mock-workflow', ['mock-step-1', 'mock-step-2']);
					assert.deepEqual(pluginSet.workflows, ['mock-workflow']);
					assert.deepEqual(pluginSet.getWorkflowSteps('mock-workflow'), [
						'mock-step-1',
						'mock-step-2'
					]);
				});
			});

			describe('.definesWorkflow(name)', () => {
				before(() => {
					pluginSet = new PluginSet();
					pluginSet.defineWorkflow('mock-workflow');
				});

				it('returns false if no workflow with the given name is defined', () => {
					assert.equal(pluginSet.definesWorkflow('non-workflow'), false);
				});

				it('returns true if a workflow with the given name is defined', () => {
					assert.equal(pluginSet.definesWorkflow('mock-workflow'), true);
				});
			});

			describe('.defineStep(step)', () => {
				before(() => {
					pluginSet = new PluginSet();
				});

				it('adds a step to the set', () => {
					pluginSet = new PluginSet();
					pluginSet.defineStep(mockStep);
					assert.deepEqual(pluginSet.steps, ['mock-step']);
				});

				describe('when a step with the same name has already been defined', () => {
					it('throws an error', () => {
						try {
							const mockDuplicateStep = {
								name: 'mock-step',
								plugin: {
									constructor: {name: 'MockPlugin'}
								},
								executor: 'mock-executor'
							};
							pluginSet.defineStep(mockDuplicateStep);
							assert.equal(true, false, 'did not throw');
						} catch (error) {
							assert.ok(error instanceof ConfigError);
							td.verify(new ConfigError(td.matchers.isA(String), {
								code: 'DUPLICATE_STEP_DEFINITION'
							}));
						}
					});
				});
			});

			describe('.definesStep(name)', () => {
				before(() => {
					pluginSet = new PluginSet();
					pluginSet.defineStep(mockStep);
				});

				it('returns false if no step with the given name is defined', () => {
					assert.equal(pluginSet.definesStep('non-step'), false);
				});

				it('returns true if a step with the given name is defined', () => {
					assert.equal(pluginSet.definesStep('mock-step'), true);
				});
			});

			describe('.getStepExecutor(name)', () => {
				it('returns the executor function for the step', () => {
					pluginSet = new PluginSet();
					pluginSet.defineStep(mockStep);
					assert.equal(pluginSet.getStepExecutor('mock-step'), 'mock-executor');
				});

				describe('when a step with the given name has not been defined', () => {
					it('returns null', () => {
						assert.equal(pluginSet.getStepExecutor('non-step'), null);
					});
				});
			});
		});
	});
});
