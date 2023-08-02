'use strict';

const {ConfigError} = require('@rmtc/config');
const {Plugin} = require('./plugin');

/**
 * @typedef {object} StepParams
 * @property {"local" | "ci"} environment
 */

/**
 * @callback StepExecutor
 * @param {StepParams} params
 * @returns {Promise<void>}
 */

/**
 * @typedef {object} Step
 * @property {string} name
 * @property {Plugin} plugin
 * @property {StepExecutor} executor
 */

class PluginSet {

	/** @type {Plugin[]} */
	#plugins = [];

	/** @type {Plugin[]} */
	get plugins() {
		return [...this.#plugins];
	}

	/** @type {Record<string, Set<string>>} */
	#workflows = {};

	/** @type {string[]} */
	get workflows() {
		return Object.keys(this.#workflows);
	}

	/** @type {Step[]} */
	#steps = [];

	/** @type {string[]} */
	get steps() {
		const stepNames = this.#steps.map(step => step.name);
		return [...new Set(stepNames)].sort();
	}

	/**
	 * @param {Plugin} plugin
	 */
	addPlugin(plugin) {
		this.#plugins.push(plugin);
	}

	/**
	 * @param {string} name
	 * @param {string[]} [defaultSteps]
	 */
	defineWorkflow(name, defaultSteps = []) {
		name = name.toLowerCase();
		this.#workflows[name] = this.#workflows[name] || new Set();
		for (const step of defaultSteps) {
			this.#workflows[name].add(step);
		}
	}

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	definesWorkflow(name) {
		return Boolean(this.#workflows[name]);
	}

	/**
	 * @param {string} name
	 * @returns {string[]}
	 */
	getWorkflowSteps(name) {
		if (this.#workflows[name]) {
			return [...this.#workflows[name]];
		}
		return [];
	}

	/**
	 * @param {Step} step
	 */
	defineStep(step) {
		const existingSteps = this.#steps.filter(existingStep => existingStep.name === step.name);
		if (existingSteps.length) {
			const pluginNames = [
				step.plugin.constructor.name,
				...existingSteps.map(existingStep => existingStep.plugin.constructor.name)
			];
			throw new ConfigError({
				code: 'DUPLICATE_STEP_DEFINITION',
				// eslint-disable-next-line max-len
				message: `The "${step.name}" step is defined by multiple plugins: ${pluginNames.join(', ')}`
			});
		}
		this.#steps.push(step);
	}

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	definesStep(name) {
		return this.#steps.some(step => step.name === name);
	}

	/**
	 * @param {string} name
	 * @returns {StepExecutor | null}
	 */
	getStepExecutor(name) {
		return this.#steps.find(step => step.name === name)?.executor || null;
	}

}

exports.PluginSet = PluginSet;
