'use strict';

const { Plugin } = require('@rmtc/plugin');

class Biome extends Plugin {
	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('biome:format', this.format.bind(this));
		this.defineStep('biome:lint', this.lint.bind(this));
		this.defineWorkflow('format', ['biome:format']);
		this.defineWorkflow('verify', ['biome:lint']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async format() {
		await this.exec('biome', ['format', '--write']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async lint() {
		await this.exec('biome', ['check']);
		this.log.info('no linting errors found');
	}
}

exports.Plugin = Biome;
