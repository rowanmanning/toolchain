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

	/**
	 * @type {import('@rmtc/plugin').InstallMethod}
	 */
	install(installManager) {
		installManager.ensureFile('example.txt');
		// Const manifest = installManager.ensureFile('example.txt');
		// Const manifest = installManager.ensureJSON('package.json');
		// manifest.ensurePropertyType('', 'object');
		// manifest.expectPropertyType('scripts', 'object');
		// manifest.expectPropertyValue('scripts.verify', 'toolchain verify');
	}

}

exports.Plugin = Eslint;
