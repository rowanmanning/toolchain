'use strict';

const {Plugin} = require('@rmtc/plugin');

class TypesInJsdoc extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').ConfigMethod}
	 */
	configure(config) {

		// Set some default configurations
		config = Object.assign({
			project: 'jsconfig.json'
		}, config);

		return config;
	}

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('types-in-jsdoc:check-types', this.checkTypes.bind(this));
		this.defineStep('types-in-jsdoc:build-typedefs', this.buildTypeDefinitions.bind(this));
		this.defineWorkflow('verify', ['types-in-jsdoc:check-types']);
		this.defineWorkflow('build', ['types-in-jsdoc:build-typedefs']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async checkTypes() {
		await this.exec('tsc', [
			'--noEmit',
			'--project',
			this.config.project
		]);
		this.log.info('no type errors found');
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async buildTypeDefinitions() {
		await this.exec('tsc', [
			'--noEmit',
			'false',
			'--emitDeclarationOnly',
			'--project',
			this.config.project
		]);
		this.log.info('type definitions built successfully');
	}

}

exports.Plugin = TypesInJsdoc;
