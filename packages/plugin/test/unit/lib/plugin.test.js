'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/plugin/lib/plugin-set', () => {
	let Logger;
	let Plugin;
	let PluginSet;
	let spawn;
	let ToolchainError;

	before(() => {
		td.reset();

		Logger = td.replace('@rmtc/logger').Logger;
		PluginSet = td.replace('../../../lib/plugin-set').PluginSet;
		spawn = td.replace('node:child_process').spawn;
		ToolchainError = td.replace('@rmtc/errors').ToolchainError;

		Plugin = require('../../../lib/plugin').Plugin;
	});

	describe('.Plugin', () => {
		it('is a class constructor', () => {
			assert.equal(typeof Plugin, 'function');
			assert.equal(typeof Plugin.prototype.constructor, 'function');
		});

		describe('new Plugin(options)', () => {
			let mockChildProcess;
			let mockInitMethod;
			let mockOptions;
			let plugin;

			before(() => {
				mockOptions = {
					config: {mockConfig: true},
					projectDirectoryPath: 'mock-directory',
					logger: new Logger(),
					pluginSet: new PluginSet()
				};
				mockOptions.pluginSet.workflows = ['mock-workflow'];

				mockChildProcess = {on: td.func()};
				td.when(spawn(), {ignoreExtraArgs: true}).thenReturn(mockChildProcess);

				const originalInitMethod = Plugin.prototype.init;
				mockInitMethod = td.func();
				Plugin.prototype.init = mockInitMethod;

				plugin = new Plugin(mockOptions);

				Plugin.prototype.init = originalInitMethod;
			});

			it('calls the plugin init method', () => {
				td.verify(mockInitMethod(), {times: 1});
			});

			describe('.config', () => {
				it('is a copy of the config object passed into the constructor', () => {
					assert.deepEqual(plugin.config, mockOptions.config);
					assert.notEqual(plugin.config, mockOptions.config);
				});

				it('is read-only', () => {
					assert.throws(() => {
						plugin.config = 'nope';
					}, /cannot set property config/i);
				});
			});

			describe('.projectDirectoryPath', () => {
				it('is the directory path passed into the constructor', () => {
					assert.equal(plugin.projectDirectoryPath, 'mock-directory');
				});

				it('is read-only', () => {
					assert.throws(() => {
						plugin.projectDirectoryPath = 'nope';
					}, /cannot set property projectDirectoryPath/i);
				});
			});

			describe('.log', () => {
				it('is the logger object passed into the constructor', () => {
					assert.equal(plugin.log, mockOptions.logger);
				});

				it('is read-only', () => {
					assert.throws(() => {
						plugin.log = 'nope';
					}, /cannot set property log/i);
				});
			});

			describe('.availableWorkflows', () => {
				it('is the value of the plugin set workflows property', () => {
					assert.equal(plugin.availableWorkflows, mockOptions.pluginSet.workflows);
				});

				it('is read-only', () => {
					assert.throws(() => {
						plugin.availableWorkflows = 'nope';
					}, /cannot set property availableWorkflows/i);
				});
			});

			describe('.defineWorkflow(name)', () => {
				it('defines a workflow on the plugin set and logs that it has done so', () => {
					mockOptions.logger.debug = td.func();
					plugin.defineWorkflow('mock-plugin-workflow');
					td.verify(
						mockOptions.pluginSet.defineWorkflow('mock-plugin-workflow', undefined),
						{times: 1}
					);
					td.verify(
						mockOptions.logger.debug('defined workflow mock-plugin-workflow'),
						{times: 1}
					);
				});
			});

			describe('.defineWorkflow(name, defaultSteps)', () => {
				it('defines a workflow on the plugin set and logs that it has done so', () => {
					mockOptions.logger.debug = td.func();
					plugin.defineWorkflow('mock-plugin-workflow', ['mock-step']);
					td.verify(
						mockOptions.pluginSet.defineWorkflow('mock-plugin-workflow', ['mock-step']),
						{times: 1}
					);
					td.verify(
						mockOptions.logger.debug('defined workflow mock-plugin-workflow'),
						{times: 1}
					);
				});
			});

			describe('.defineStep(name, executor)', () => {
				it('defines a step on the plugin set and logs that it has done so', () => {
					plugin.defineStep('mock-plugin-step', 'mock-executor');
					td.verify(
						mockOptions.pluginSet.defineStep({
							name: 'mock-plugin-step',
							plugin,
							executor: 'mock-executor'
						}),
						{times: 1}
					);
					td.verify(
						mockOptions.logger.debug('defined step mock-plugin-step'),
						{times: 1}
					);
				});
			});

			describe('.exec(command)', () => {
				it('spawns a child process and resolves when it exits', async () => {
					td.when(mockChildProcess.on('close')).thenCallback(0);
					await plugin.exec('mock-command');
					td.verify(
						spawn(
							'npx',
							['mock-command'],
							{stdio: 'inherit'}
						),
						{times: 1}
					);
					td.verify(
						mockOptions.logger.debug(`spawning child process: mock-command`),
						{times: 1}
					);
				});

				describe('when the child process exits without a code', () => {
					it('spawns a child process and resolves when it exits', async () => {
						td.when(mockChildProcess.on('close')).thenCallback();
						await plugin.exec('mock-command');
					});
				});

				describe('when the child process exits with a non-zero code', () => {
					it('rejects with an error', async () => {
						try {
							td.when(mockChildProcess.on('close')).thenCallback(1);
							await plugin.exec('mock-command');
							assert.equal(true, false, 'did not throw');
						} catch (error) {
							assert.ok(error instanceof ToolchainError);
							td.verify(new ToolchainError(td.matchers.isA(String), {
								code: 'COMMAND_FAILED'
							}));
						}
					});
				});
			});

			describe('.exec(command, args)', () => {
				it('spawns a child process with arguments and resolves when it exits', async () => {
					td.when(mockChildProcess.on('close')).thenCallback(0);
					await plugin.exec('mock-command', ['mock-arg-1', 'mock-arg-2']);
					td.verify(
						spawn(
							'npx',
							['mock-command', 'mock-arg-1', 'mock-arg-2'],
							{stdio: 'inherit'}
						),
						{times: 1}
					);
					td.verify(
						mockOptions.logger.debug(
							`spawning child process: mock-command mock-arg-1 mock-arg-2`
						),
						{times: 1}
					);
				});
			});

			describe('.configure(config)', () => {
				it('returns the passed-in config object unmodified', () => {
					assert(plugin.configure('mock-config'), 'mock-config');
				});
			});

			describe('.init()', () => {
				it('does nothing', () => {
					// Pretty difficult to test. I tried inspecting the
					// function body as a string but this messes up when
					// the code is instrumented for coverage
					plugin.init();
				});
			});
		});
	});
});
