'use strict';

const {ToolchainError} = require('@rmtc/errors');
const {loadPlugins} = require('@rmtc/plugin');

class Runner {

	/** @type {import('@rmtc/plugin').PluginSet} */
	#pluginSet;

	/** @type {import('@rmtc/logger').Logger} */
	#logger;

	/**
	 * @param {object} options
	 * @param {import('@rmtc/config').Config} options.config
	 * @param {import('@rmtc/logger').Logger} options.logger
	 */
	constructor({config, logger}) {
		this.#pluginSet = loadPlugins(config);
		this.#logger = logger;
	}

	/**
	 * @param {string} name
	 * @param {import('@rmtc/plugin').StepParams} params
	 * @returns {Promise<void>}
	 */
	async executeWorkflow(name, params) {
		this.#logger.info(`executing workflow "${name}"`);

		// Check whether the workflow is defined
		if (!this.#pluginSet.definesWorkflow(name)) {
			throw new ToolchainError({
				code: 'WORKFLOW_MISSING',
				message: `A workflow named "${name}" was not defined by any plugin`
			});
		}

		// Attempt to execute each step in the workflow
		for (const stepName of this.#pluginSet.getWorkflowSteps(name)) {
			try {
				this.#logger.info(`executing workflow step "${name}.${stepName}"`);
				await this.executeStep(stepName, params);
				this.#logger.debug(`completed workflow step "${name}.${stepName}"`);
			} catch (/** @type {any} */ error) {
				throw new ToolchainError({
					code: 'WORKFLOW_FAILED',
					message: `The workflow "${name}" failed to execute`,
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
		const stepExecutor = this.#pluginSet.getStepExecutor(name);

		// Check whether the step is defined
		if (!stepExecutor) {
			throw new ToolchainError({
				code: 'STEP_MISSING',
				message: `A step named "${name}" was not defined by any plugin`
			});
		}

		// Attempt to execute the step
		try {
			await stepExecutor(params);
		} catch (/** @type {any} */ error) {
			throw new ToolchainError({
				code: 'STEP_FAILED',
				message: `The step "${name}" failed to execute`,
				cause: error
			});
		}
	}

}

exports.Runner = Runner;
