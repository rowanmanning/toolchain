'use strict';

/**
 * @typedef {object} ToolchainErrorOptions
 * @property {string} [code]
 * @property {Error} [cause]
 */

class ToolchainError extends Error {

	/** @type {string} */
	#code;

	/** @type {string} */
	get code() {
		return this.#code;
	}

	/** @type {string} */
	name = 'ToolchainError';

	/**
	 * @param {string} message
	 * @param {ToolchainErrorOptions} [options]
	 */
	constructor(message, {code, cause} = {}) {
		super(message, {cause});
		this.#code = code || 'TOOLCHAIN_ERROR';
	}

}

exports.ToolchainError = ToolchainError;
