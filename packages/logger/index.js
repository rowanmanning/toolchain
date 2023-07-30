'use strict';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3
};

class Logger {

	/** @type {number} */
	#level = levels.info;

	/** @type {string} */
	#prefix;

	/**
	 * @param {object} [options]
	 * @param {string | number} [options.logLevel]
	 * @param {string} [options.prefix]
	 */
	constructor({logLevel = process.env.LOG_LEVEL, prefix = ''} = {}) {
		if (typeof logLevel === 'string') {
			this.#level = levels[logLevel] || levels.info;
		} else if (logLevel) {
			this.#level = logLevel;
		}
		this.#prefix = prefix;
	}

	/**
	 * @param {object} options
	 * @param {string} [options.prefix]
	 * @returns {Logger}
	 */
	child({prefix}) {
		return new Logger({
			logLevel: this.#level,
			prefix: prefix ? this.#prefixMessage(prefix) : this.#prefix
		});
	}

	/**
	 * @param {string} message
	 * @returns {string}
	 */
	#prefixMessage(message) {
		return `${this.#prefix ? `${this.#prefix} ` : ''}${message}`;
	}

	/**
	 * @param {string | Error} message
	 */
	error(message) {
		if (this.#level >= levels.error) {
			if (message instanceof Error) {
				process.stdout.write(
					this.#prefixMessage(
						`an error occurred:\n${this.#stringifyError(message)}`
					)
				);
			} else {
				process.stdout.write(this.#prefixMessage(`${message}\n`));
			}
		}
	}

	/**
	 * @param {Error} error
	 * @param {number} indent
	 * @returns {string}
	 */
	#stringifyError(error, indent = 1) {
		const padding = Array(indent).fill('  ').join('');
		let string = `${padding}└─ `;
		string += `${error.name}: ${error.message}\n`;
		if (error.cause instanceof Error) {
			string += `${this.#stringifyError(error.cause, indent + 1)}`;
		}
		return string;
	}

	/**
	 * @param {string} message
	 */
	warn(message) {
		if (this.#level >= levels.warn) {
			process.stdout.write(this.#prefixMessage(`${message}\n`));
		}
	}

	/**
	 * @param {string} message
	 */
	info(message) {
		if (this.#level >= levels.info) {
			process.stdout.write(this.#prefixMessage(`${message}\n`));
		}
	}

	/**
	 * @param {string} message
	 */
	debug(message) {
		if (this.#level >= levels.debug) {
			process.stdout.write(this.#prefixMessage(`${message}\n`));
		}
	}

}

exports.Logger = Logger;
