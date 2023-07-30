'use strict';

const {ToolchainError} = require('@rmtc/errors');

/**
 * @typedef {object} ConfigErrorOptions
 * @property {import('ajv').ErrorObject[]} [validationErrors]
 */

class ConfigError extends ToolchainError {

	/** @type {string} */
	name = 'ConfigError';

	/**
	 * @param {import('@rmtc/errors').ToolchainErrorOptions & ConfigErrorOptions} options
	 */
	constructor(options) {
		super(options);
		const {message, validationErrors} = options;
		if (validationErrors?.length) {
			const self = /** @type {typeof ConfigError} */ (this.constructor);
			this.validationErrors = validationErrors;
			this.message = `${message}:\n${self.validationErrorsToString(validationErrors)}`;
		}
	}

	/**
	 * @param {import('ajv').ErrorObject[]} validationErrors
	 * @returns {string}
	 */
	static validationErrorsToString(validationErrors) {
		return validationErrors.map(error => {
			const dotPath = error.instancePath.slice(1).replaceAll('/', '.');
			return `  - ${dotPath}: ${error.message}`;
		}).join('\n');
	}

}
exports.ConfigError = ConfigError;
