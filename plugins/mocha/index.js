'use strict';

const {ConfigError} = require('@rmtc/config');
const {Plugin} = require('@rmtc/plugin');

class Mocha extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').ConfigMethod}
	 */
	configure(config) {

		// Set some default configurations
		config = Object.assign({
			coverage: false,
			type: null
		}, config);

		// Validate the test type
		if (config.type !== null && typeof config.type !== 'string') {
			throw new ConfigError({
				code: 'MOCHA_PLUGIN_CONFIG_INVALID',
				message: `The mocha plugin "type" config option must be a string or null`
			});
		}

		// Validate the test coverage flag
		if (typeof config.coverage !== 'boolean') {
			throw new ConfigError({
				code: 'MOCHA_PLUGIN_CONFIG_INVALID',
				message: `The mocha plugin "coverage" config option must be a boolean`
			});
		}

		return config;
	}

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		if (this.config.type) {
			this.defineStep(`mocha:${this.config.type}`, this.buildMochaFunction(this.config.type));
			this.defineWorkflow(`test:${this.config.type}`, [`mocha:${this.config.type}`]);
			this.defineWorkflow(`test`, [`mocha:${this.config.type}`]);
		} else {
			this.defineStep(`mocha`, this.buildMochaFunction());
			this.defineWorkflow(`test`, ['mocha']);
		}
	}

	/**
	 * @param {string | null} [type]
	 * @returns {import('@rmtc/plugin').StepFunction}
	 */
	buildMochaFunction(type) {
		const extensions = ['js', 'cjs', 'mjs'];
		return async () => {
			const mochaParams = [
				'--recursive',
				...extensions.flatMap(extension => [
					'--extension', `test.${extension}`,
					'--extension', `spec.${extension}`
				])
			];

			mochaParams.push(type ? `**/test/${type}/**` : '**/test/**');

			if (this.config.coverage) {
				await this.exec('nyc', ['mocha', ...mochaParams]);
			} else {
				await this.exec('mocha', mochaParams);
			}
			this.log.info('all tests passed');
		};
	}

}

exports.Plugin = Mocha;
