'use strict';

const {Plugin} = require('@rmtc/plugin');

class Eslint extends Plugin {

	initialise() {
		this.defineStep('eslint', this.eslint.bind(this));
		this.defineWorkflow('verify', ['eslint']);
	}

	/**
	 * @param {import('@rmtc/plugin').StepParams} params
	 */
	// eslint-disable-next-line require-await
	async eslint(params) {
		this.log.info(`running eslint with params ${JSON.stringify(params)}`);
	}

}

exports.Plugin = Eslint;
