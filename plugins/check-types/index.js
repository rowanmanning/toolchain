'use strict';

const {Plugin} = require('@rmtc/plugin');

class CheckTypes extends Plugin {

	initialise() {
		this.defineStep('check-types', this.checkTypes.bind(this));
		this.defineWorkflow('verify', ['check-types']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async checkTypes() {
		const projectPath = this.config.project || 'jsconfig.json';
		await this.exec('tsc', ['--noEmit', '--project', projectPath]);
		this.log.info('no type errors found');
	}

}

exports.Plugin = CheckTypes;
