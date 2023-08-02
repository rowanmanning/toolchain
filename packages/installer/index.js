'use strict';

const {FileInstallStep} = require('./steps/file');
const {InstallStep} = require('./steps/base');
const path = require('node:path');
const {ToolchainError} = require('@rmtc/errors');

class InstallManager {

	/** @type {import('@rmtc/config').Config} */
	#config;

	/** @type {import('@rmtc/logger').Logger} */
	#logger;

	/** @type {import('@rmtc/plugin').PluginSet} */
	#pluginSet;

	/** @type {InstallStep[]} */
	#steps = [];

	/**
	 * @param {object} options
	 * @param {import('@rmtc/config').Config} options.config
	 * @param {import('@rmtc/logger').Logger} options.logger
	 * @param {import('@rmtc/plugin').PluginSet} options.pluginSet
	 */
	constructor({config, logger, pluginSet}) {
		this.#config = config;
		this.#logger = logger.child({prefix: '[Install]'});
		this.#pluginSet = pluginSet;
		this.#loadInstallSteps();
	}

	/**
	 * @returns {void}
	 */
	#loadInstallSteps() {
		for (const plugin of this.#pluginSet.plugins) {
			try {
				this.#logger.debug(`Loading install steps for "${plugin.constructor.name}"`);
				plugin.install(this);
			} catch (/** @type {any} */ error) {
				throw new InstallError({
					code: 'INSTALL_FAILED',
					message: `The plugin "${plugin.constructor.name}" install failed to execute`,
					cause: error
				});
			}
		}
	}

	/**
	 * @param {InstallStep} step
	 */
	addInstallStep(step) {
		this.#steps.push(step);
	}

	/**
	 * @param {string} filePath
	 * @returns {string}
	 */
	#resolveFilePath(filePath) {
		return path.resolve(this.#config.directoryPath, filePath);
	}

	/**
	 * @param {string} filePath
	 * @returns {FileInstallStep}
	 */
	ensureFile(filePath) {
		return new FileInstallStep(this, this.#resolveFilePath(filePath));
	}

	/**
	 * @returns {Promise<void>}
	 */
	async validate() {
		this.#logger.debug('Validating that install steps are applied');
		for (const step of this.#steps) {
			// @ts-ignore we ignore this because we want this method
			// to be defined as protected in the step class to prevent
			// use in plugins, but we do need to use it here
			await step.assertIsApplied();
		}
	}

	/**
	 * @returns {Promise<void>}
	 */
	async apply() {
		this.#logger.info('Applying changes');
		for (const step of this.#steps) {
			// @ts-ignore we ignore this because we want this method
			// to be defined as protected in the step class to prevent
			// use in plugins, but we do need to use it here
			await step.applyIfNotApplied();
		}
	}

}

class InstallError extends ToolchainError {

	name = 'InstallError';

}

exports.InstallManager = InstallManager;
exports.InstallStep = InstallStep;
