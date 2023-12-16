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

		describe('new ConfigError(message)', () => {

			before(() => {
				// eslint-disable-next-line no-new
				new ConfigError('mock message');
			});

			it('calls the ToolchainError constructor', () => {
				td.verify(
					ToolchainError.prototype.constructor('mock message', {}),
					{times: 1}
				);
			});
		});

		describe('new ConfigError(message, options)', () => {
			let configError;
			let options;

			before(() => {
				options = {code: 'MOCK_CODE'};
				configError = new ConfigError('mock message', options);
			});

			it('calls the ToolchainError constructor', () => {
				td.verify(
					ToolchainError.prototype.constructor('mock message', options),
					{times: 1}
				);
			});

			describe('.validationErrors', () => {
				it('is an empty array', () => {
					assert.deepEqual(configError.validationErrors, []);
				});
			});

			describe('when options.validationErrors is an array', () => {
				before(() => {
					options = {
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
					configError = new ConfigError('mock message', options);
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
