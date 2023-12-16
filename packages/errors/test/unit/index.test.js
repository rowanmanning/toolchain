'use strict';

const assert = require('node:assert/strict');

describe('@rmtc/errors', () => {
	let ToolchainError;

	before(() => {
		ToolchainError = require('../..').ToolchainError;
	});

	describe('.ToolchainError', () => {
		it('is a class constructor', () => {
			assert.equal(typeof ToolchainError, 'function');
			assert.equal(typeof ToolchainError.prototype.constructor, 'function');
		});

		it('extends Error', () => {
			assert.ok(ToolchainError.prototype instanceof Error);
		});

		describe('new ToolchainError(message)', () => {
			let error;

			before(() => {
				error = new ToolchainError('mock message');
			});

			describe('.message', () => {
				it('is the configured message', () => {
					assert.equal(error.message, 'mock message');
				});
			});

			describe('.code', () => {
				it('is a default error code', () => {
					assert.equal(error.code, 'TOOLCHAIN_ERROR');
				});

				it('is read-only', () => {
					assert.throws(() => {
						error.code = 'nope';
					}, /cannot set property code/i);
				});
			});

			describe('.cause', () => {
				it('is not defined', () => {
					assert.equal(error.cause, undefined);
				});
			});
		});

		describe('new ToolchainError(message, options)', () => {
			let cause;
			let error;

			before(() => {
				cause = new Error('mock cause');
				error = new ToolchainError('mock message', {
					code: 'MOCK_CODE',
					cause
				});
			});

			describe('.message', () => {
				it('is the configured message', () => {
					assert.equal(error.message, 'mock message');
				});
			});

			describe('.code', () => {
				it('is a configured error code', () => {
					assert.equal(error.code, 'MOCK_CODE');
				});

				it('is read-only', () => {
					assert.throws(() => {
						error.code = 'nope';
					}, /cannot set property code/i);
				});
			});

			describe('.cause', () => {
				it('is the configured cause', () => {
					assert.equal(error.cause, cause);
				});
			});
		});
	});
});
