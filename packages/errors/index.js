'use strict';

/**
 * @typedef {object} ToolchainErrorOptions
 * @property {string} [code]
 * @property {string} [message]
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
	 * @param {ToolchainErrorOptions} options
	 */
	constructor({code, message, cause}) {
		super(message, {cause});
		this.#code = code || 'TOOLCHAIN_ERROR';
	}

}

exports.ToolchainError = ToolchainError;
