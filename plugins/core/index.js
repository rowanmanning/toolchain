'use strict';

const {Plugin} = require('@rmtc/plugin');

class Core extends Plugin {

	initialise() {
		this.defineStep('core:install', this.install.bind(this));
		this.defineWorkflow('install', ['core:install']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	// eslint-disable-next-line require-await
	async install() {
		this.log.info('TODO');
	}

}

exports.Plugin = Core;
