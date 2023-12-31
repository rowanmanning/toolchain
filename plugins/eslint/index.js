'use strict';

const {Plugin} = require('@rmtc/plugin');

class Eslint extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('eslint', this.eslint.bind(this));
		this.defineWorkflow('verify', ['eslint']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async eslint() {
		await this.exec('eslint', ['.']);
		this.log.info('no eslint errors found');
	}

}

exports.Plugin = Eslint;
