'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/config/lib/error', () => {
	let ConfigError;
	let ToolchainError;

	before(() => {
		td.reset();

		ToolchainError = td.replace('@rmtc/errors').ToolchainError;
		ConfigError = require('../../../lib/error').ConfigError;
	});

	describe('.ConfigError', () => {
		it('is a class constructor', () => {
			assert.equal(typeof ConfigError, 'function');
			assert.equal(typeof ConfigError.prototype.constructor, 'function');
		});

		it('extends ToolchainError', () => {
			assert.ok(ConfigError.prototype instanceof ToolchainError);
		});

		describe('new ConfigError(options)', () => {
			let configError;
			let options;

			before(() => {
				options = {
					message: 'mock message'
				};
				configError = new ConfigError(options);
			});

			it('calls the ToolchainError constructor', () => {
				td.verify(ToolchainError.prototype.constructor(options), {times: 1});
			});

			describe('.validationErrors', () => {
				it('is an empty array', () => {
					assert.deepEqual(configError.validationErrors, []);
				});
			});

			describe('when options.validationErrors is an array', () => {

				before(() => {
					options = {
						message: 'mock message',
						validationErrors: [
							{
								message: 'mock validation error 1',
								instancePath: '/mock/path/one'
							},
							{
								message: 'mock validation error 2',
								instancePath: '/mock/path/two'
							}
						]
					};
					configError = new ConfigError(options);
				});

				describe('.validationErrors', () => {
					it('is the input error array', () => {
						assert.deepEqual(configError.validationErrors, options.validationErrors);
					});
				});

				describe('.message', () => {
					it('is a summary of the error and related validation errors', () => {
						assert.equal(
							configError.message,
							'mock message:\n' +
							'  - mock.path.one: mock validation error 1\n' +
							'  - mock.path.two: mock validation error 2'
						);
					});
				});

			});
		});
	});
});
