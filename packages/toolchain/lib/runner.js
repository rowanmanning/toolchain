'use strict';

const {ConfigError} = require('@rmtc/config');
const {loadPlugins} = require('@rmtc/plugin');
const {ToolchainError} = require('@rmtc/errors');

class Runner {

	/** @type {import('@rmtc/config').Config} */
	#config;

	/** @type {import('@rmtc/plugin').PluginSet} */
	#pluginSet;

	/** @type {import('@rmtc/logger').Logger} */
	#logger;

	/** @type {string[]} */
	get workflows() {
		return this.#pluginSet.workflows;
	}

	/** @type {string[]} */
	get steps() {
		return this.#pluginSet.steps;
	}

	/**
	 * @param {object} options
	 * @param {import('@rmtc/config').Config} options.config
	 * @param {import('@rmtc/logger').Logger} options.logger
	 */
	constructor({config, logger}) {
		this.#config = config;
		this.#pluginSet = loadPlugins(config).initPlugins();
		this.#logger = logger.child({prefix: '[Runner]'});
	}

	/**
	 * @returns {void}
	 */
	revalidateConfig() {
		const allSteps = Object.values(this.#config.workflows).flat();
		for (const step of allSteps) {
			this.#assertStepDefined(step);
		}
	}

	/**
	 * @param {string} name
	 * @returns {void}
	 */
	#assertWorkflowDefined(name) {
		const workflowInConfig = Boolean(this.#config.workflows[name]);
		const workflowInPluginSet = this.#pluginSet.definesWorkflow(name);
		if (!workflowInConfig && !workflowInPluginSet) {
			throw new ConfigError(
				`A workflow named "${name}" was not defined by a plugin or config file`,
				{code: 'WORKFLOW_MISSING'}
			);
		}
	}

	/**
	 * @param {string} name
	 * @returns {void}
	 */
	#assertStepDefined(name) {
		if (!this.#pluginSet.definesStep(name)) {
			throw new ConfigError(
				`A step named "${name}" was not defined by any plugin`,
				{code: 'STEP_MISSING'}
			);
		}
	}

	/**
	 * @param {string} name
	 * @param {import('@rmtc/plugin').StepParams} params
	 * @returns {Promise<void>}
	 */
	async executeWorkflow(name, params) {
		this.#logger.info(`executing workflow "${name}"`);
		this.#assertWorkflowDefined(name);

		// Get the steps from the config if set, otherwise get
		// it from the plugin set
		const steps = this.#config.workflows[name] || this.#pluginSet.getWorkflowSteps(name);

		// Attempt to execute each step in the workflow
		for (const stepName of steps) {
			try {
				this.#logger.info(`executing workflow step "${name}.${stepName}"`);
				await this.executeStep(stepName, params);
				this.#logger.debug(`completed workflow step "${name}.${stepName}"`);
			} catch (/** @type {any} */ error) {
				throw new ToolchainError(`The workflow "${name}" failed to execute`, {
					code: 'WORKFLOW_FAILED',
					cause: error
				});
			}
		}

		this.#logger.debug(`completed workflow "${name}"`);
	}

	/**
	 * @param {string} name
	 * @param {import('@rmtc/plugin').StepParams} params
	 * @returns {Promise<void>}
	 */
	async executeStep(name, params) {
		this.#assertStepDefined(name);
		const stepExecutor = this.#pluginSet.getStepExecutor(name);

		// Attempt to execute the step
		try {
			if (stepExecutor) {
				await stepExecutor(params);
			}
		} catch (/** @type {any} */ error) {
			throw new ToolchainError(`The step "${name}" failed to execute`, {
				code: 'STEP_FAILED',
				cause: error
			});
		}
	}

}

exports.Runner = Runner;
