'use strict';

const {Plugin} = require('@rmtc/plugin');

class Eslint extends Plugin {

	initialise() {
		this.defineStep('eslint', this.eslint.bind(this));
		this.defineWorkflow('verify', ['eslint']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async eslint() {
		await this.exec('eslint', ['.']);
	}

}

exports.Plugin = Eslint;
