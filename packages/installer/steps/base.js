'use strict';

const {ToolchainError} = require('@rmtc/errors');

class InstallStep {

	/** @type {string} */
	errorMessage = `${this.constructor.name} is not applied`;

	/** @type {import('..').InstallManager} */
	#manager;

	/** @type {import('..').InstallManager} */
	get manager() {
		return this.#manager;
	}

	/**
	 * @param {import('..').InstallManager} manager
	 */
	constructor(manager) {
		this.#manager = manager;
		manager.addInstallStep(this);
	}

	/**
	 * @protected
	 * @returns {Promise<boolean>}
	 */
	isApplied() {
		return Promise.resolve(true);
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async assertIsApplied() {
		if (!await this.isApplied()) {
			throw new InstallStepError({
				code: 'INSTALL_STEP_NOT_APPLIED',
				message: this.errorMessage
			});
		}
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	apply() {
		return Promise.resolve();
	}

	/**
	 * @protected
	 * @returns {Promise<void>}
	 */
	async applyIfNotApplied() {
		const isApplied = await this.isApplied();
		if (!isApplied) {
			await this.apply();
		}
	}

}

class InstallStepError extends ToolchainError {

	name = 'InstallStepError';

}

exports.InstallStep = InstallStep;
