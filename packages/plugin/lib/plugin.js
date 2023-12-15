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
 * @callback ConfigMethod
 * @param {PluginConfig} config
 * @returns {PluginConfig}
 */

class Plugin {

	/** @type {PluginConfig} */
	#config;

	/** @type {PluginConfig} */
	get config() {
		return this.#config;
	}

	/** @type {string} */
	#projectDirectoryPath;

	/** @type {string} */
	get projectDirectoryPath() {
		return this.#projectDirectoryPath;
	}

	/** @type {import('@rmtc/logger').Logger} */
	#logger;

	/** @type {import('@rmtc/logger').Logger} */
	get log() {
		return this.#logger;
	}

	/** @type {import('./plugin-set').PluginSet} */
	#pluginSet;

	/** @type {string[]} */
	get availableWorkflows() {
		return this.#pluginSet.workflows;
	}

	/**
	 * @param {object} options
	 * @param {PluginConfig} options.config
	 * @param {string} options.projectDirectoryPath
	 * @param {import('@rmtc/logger').Logger} options.logger
	 * @param {import('./plugin-set').PluginSet} options.pluginSet
	 */
	constructor({config, projectDirectoryPath, logger, pluginSet}) {
		this.#projectDirectoryPath = projectDirectoryPath;
		this.#logger = logger;
		this.#pluginSet = pluginSet;
		this.#config = Object.freeze(this.configure(structuredClone(config)));
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
			this.log.debug(`spawning child process: ${command} ${args.join(' ')}`);
			const child = spawn('npx', [command, ...args], {stdio: 'inherit'});
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

	/**
	 * @type {ConfigMethod}
	 */
	configure(config) {
		return config;
	}

	/**
	 * @type {InitMethod}
	 */
	init() {
		// Intentionally empty
	}

}

class CommandError extends ToolchainError {

	name = 'CommandError';

}


exports.Plugin = Plugin;
