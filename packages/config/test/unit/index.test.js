'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/config', () => {
	let Ajv;
	let ajvErrors;
	let Config;
	let ConfigError;
	let configSchema;
	let JSON5;
	let Logger;
	let module;
	let path;
	let readFile;
	let validateConfigSchema;

	before(() => {
		td.reset();

		Ajv = td.replace('ajv/dist/2020').default;
		ajvErrors = td.replace('ajv-errors').default;
		ConfigError = td.replace('../../lib/error').ConfigError;
		JSON5 = td.replace('json5');
		Logger = td.replace('@rmtc/logger').Logger;
		path = td.replace('node:path');
		readFile = td.replace('node:fs/promises').readFile;

		validateConfigSchema = td.func();
		td.when(validateConfigSchema(td.matchers.anything())).thenReturn(true);

		configSchema = require('../../schema.json');
		td.when(Ajv.prototype.compile(configSchema)).thenReturn(validateConfigSchema);

		module = require('../..');
		Config = module.Config;
	});

	describe('on import', () => {
		it('creates an Ajv validator with the config file schema', () => {
			td.verify(new Ajv({ allErrors: true }), { times: 1 });
			td.verify(Ajv.prototype.compile(configSchema), { times: 1 });
		});

		it('initialises the ajv-errors plugin', () => {
			td.verify(ajvErrors(new Ajv()), { times: 1 });
		});
	});

	describe('.Config', () => {
		it('is a class constructor', () => {
			assert.equal(typeof Config, 'function');
			assert.equal(typeof Config.prototype.constructor, 'function');
		});

		describe('new Config(paths, configData)', () => {
			let config;
			let configData;

			before(() => {
				configData = {
					plugins: ['mock-plugin-1', ['mock-plugin-2', { mockConfig: true }]],
					workflows: { 'mock-workflow': ['mock-step'] }
				};
				config = new Config(
					{
						directoryPath: 'mock-directory',
						filePath: 'mock-file'
					},
					configData
				);
			});

			it('creates a logger', () => {
				td.verify(new Logger({ prefix: '[Config]' }), { times: 1 });
			});

			it('validates the config data against the schema', () => {
				td.verify(validateConfigSchema(configData), { times: 1 });
			});

			it('logs that the config has been loaded', () => {
				td.verify(Logger.prototype.debug('loaded from "mock-file"'), { times: 1 });
			});

			describe('.directoryPath', () => {
				it('contains the directory path passed into the constructor', () => {
					assert.equal(config.directoryPath, 'mock-directory');
				});

				it('is read-only', () => {
					assert.throws(() => {
						config.directoryPath = 'nope';
					}, /cannot set property directoryPath/i);
				});
			});

			describe('.filePath', () => {
				it('contains the file path passed into the constructor', () => {
					assert.equal(config.filePath, 'mock-file');
				});

				it('is read-only', () => {
					assert.throws(() => {
						config.filePath = 'nope';
					}, /cannot set property filePath/i);
				});
			});

			describe('.plugins', () => {
				it('contains a list of plugin definitions based on the config data', () => {
					assert.deepEqual(config.plugins, [
						{
							path: 'mock-plugin-1',
							config: {}
						},
						{
							path: 'mock-plugin-2',
							config: { mockConfig: true }
						}
					]);
				});

				it('is read-only', () => {
					assert.throws(() => {
						config.plugins = 'nope';
					}, /cannot set property plugins/i);
				});
			});

			describe('.workflows', () => {
				it('contains a map of workflows based on the config data', () => {
					assert.deepEqual(config.workflows, {
						'mock-workflow': ['mock-step']
					});
				});

				it('is read-only', () => {
					assert.throws(() => {
						config.workflows = 'nope';
					}, /cannot set property workflows/i);
				});
			});

			describe('when configData.workflows is not defined', () => {
				before(() => {
					config = new Config(
						{
							directoryPath: 'mock-directory',
							filePath: 'mock-file'
						},
						{
							plugins: []
						}
					);
				});

				describe('.workflows', () => {
					it('contains an empty map', () => {
						assert.deepEqual(config.workflows, {});
					});
				});
			});

			describe('when configData does not match the config schema', () => {
				before(() => {
					validateConfigSchema.errors = ['mock-error'];
					td.when(validateConfigSchema(td.matchers.anything())).thenReturn(false);
				});

				it('throws a config error using the underlying Ajv errors', () => {
					try {
						config = new Config(
							{
								directoryPath: 'mock-directory',
								filePath: 'mock-file'
							},
							{}
						);
						assert.equal(true, false, 'did not throw');
					} catch (error) {
						assert.ok(error instanceof ConfigError);
						td.verify(
							new ConfigError(td.matchers.isA(String), {
								code: 'CONFIG_INVALID_SCHEMA',
								validationErrors: ['mock-error']
							})
						);
					}
				});
			});
		});

		describe('.fromFile(directoryPath)', () => {
			let config;

			before(async () => {
				td.when(validateConfigSchema(td.matchers.anything())).thenReturn(true);
				td.when(path.resolve('mock-directory', '.rmtc.json5')).thenReturn(
					'mock-resolved-file'
				);
				td.when(readFile('mock-resolved-file', 'utf-8')).thenResolve('mock-file-contents');
				td.when(JSON5.parse('mock-file-contents')).thenReturn({
					plugins: ['mock-plugin-from-file']
				});
				config = await Config.fromFile('mock-directory');
			});

			it('reads the config file in the given directory as JSON5', () => {
				td.verify(readFile('mock-resolved-file', 'utf-8'), { times: 1 });
				td.verify(JSON5.parse('mock-file-contents'), { times: 1 });
			});

			it('returns a config instance configured as expected', () => {
				assert.ok(config instanceof Config);
				assert.equal(config.directoryPath, 'mock-directory');
				assert.equal(config.filePath, 'mock-resolved-file');
				assert.deepEqual(config.plugins, [
					{
						path: 'mock-plugin-from-file',
						config: {}
					}
				]);
			});

			describe('when the config file does not exist', () => {
				let mockError;

				before(() => {
					mockError = new Error('mock error');
					mockError.code = 'ENOENT';
					td.when(readFile('mock-resolved-file', 'utf-8')).thenReject(mockError);
				});

				it('throws a config error', async () => {
					try {
						config = await Config.fromFile('mock-directory');
						assert.equal(true, false, 'did not throw');
					} catch (error) {
						assert.ok(error instanceof ConfigError);
						td.verify(
							new ConfigError(td.matchers.isA(String), {
								code: 'CONFIG_MISSING',
								cause: mockError
							}),
							{ times: 1 }
						);
					}
				});
			});

			describe('when the config file is invalid JSON5', () => {
				let mockError;

				before(() => {
					mockError = new SyntaxError('mock error');
					td.when(readFile('mock-resolved-file', 'utf-8')).thenResolve(
						'mock-file-contents'
					);
					td.when(JSON5.parse('mock-file-contents')).thenThrow(mockError);
				});

				it('throws a config error', async () => {
					try {
						config = await Config.fromFile('mock-directory');
						assert.equal(true, false, 'did not throw');
					} catch (error) {
						assert.ok(error instanceof ConfigError);
						td.verify(
							new ConfigError(td.matchers.isA(String), {
								code: 'CONFIG_INVALID_JSON5',
								cause: mockError
							}),
							{ times: 1 }
						);
					}
				});
			});

			describe('when a general error is thrown', () => {
				let mockError;

				before(() => {
					mockError = new Error('mock error');
					td.when(readFile('mock-resolved-file', 'utf-8')).thenReject(mockError);
				});

				it('rethrows the error', async () => {
					await assert.rejects(Config.fromFile('mock-directory'), mockError);
				});
			});
		});
	});

	describe('.ConfigError', () => {
		it('aliases @rmtc/config/lib/error', () => {
			assert.equal(module.ConfigError, ConfigError);
		});
	});
});
