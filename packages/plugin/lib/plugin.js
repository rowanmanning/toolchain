'use strict';

/**
 * @typedef {Record<string, any>} PluginConfig
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
		this.initialise();
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

	initialise() {
		throw new Error('The Plugin class `initialise` method must be extended');
	}

}

exports.Plugin = Plugin;
