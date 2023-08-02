'use strict';

const {spawn} = require('node:child_process');
const {ToolchainError} = require('@rmtc/errors');

/**
 * @typedef {Record<string, any>} PluginConfig
 */

/**
 * @callback InitMethod
 * @returns {void}
 */

/**
 * @callback InstallMethod
 * @param {import('@rmtc/installer').InstallManager} installManager
 * @returns {void}
 */

class Plugin {

	/** @type {PluginConfig} */
	#config;

	/** @type {PluginConfig} */
	get config() {
		return this.#config;
	}

	/** @type {import('@rmtc/logger').Logger} */
	#logger;

	/** @type {import('@rmtc/logger').Logger} */
	get log() {
		return this.#logger;
	}

	/** @type {import('./plugin-set').PluginSet} */
	#pluginSet;

	/**
	 * @param {object} options
	 * @param {PluginConfig} options.config
	 * @param {import('@rmtc/logger').Logger} options.logger
	 * @param {import('./plugin-set').PluginSet} options.pluginSet
	 */
	constructor({config, logger, pluginSet}) {
		this.#config = Object.freeze(structuredClone(config));
		this.#logger = logger;
		this.#pluginSet = pluginSet;
		this.init();
	}

	/**
	 * @param {string} name
	 * @param {string[]} [defaultSteps]
	 */
	defineWorkflow(name, defaultSteps) {
		this.log.debug(`defined workflow ${name}`);
		this.#pluginSet.defineWorkflow(name, defaultSteps);
	}

	/**
	 * @param {string} name
	 * @param {import('./plugin-set').StepExecutor} executor
	 */
	defineStep(name, executor) {
		this.log.debug(`defined step ${name}`);
		this.#pluginSet.defineStep({
			name,
			plugin: this,
			executor
		});
	}

	/**
	 * @param {string} command
	 * @param {string[]} [args]
	 * @returns {Promise<void>}
	 */
	exec(command, args = []) {
		return new Promise((resolve, reject) => {
			const child = spawn(command, args, {stdio: 'inherit'});
			child.on('close', code => {
				if (!code || code === 0) {
					return resolve();
				}
				reject(new CommandError({
					code: 'COMMAND_FAILED',
					message: `Command "${command}" exited with code ${code}`
				}));
			});
		});
	}

	init() {
		throw new Error('The Plugin class `init` method must be extended');
	}

	/**
	 * @type {InstallMethod}
	 */
	install() {
		// Intentionally empty
	}

}

class CommandError extends ToolchainError {

	name = 'CommandError';

}


exports.Plugin = Plugin;
