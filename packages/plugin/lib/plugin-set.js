'use strict';

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
		this.#steps.push(step);
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
