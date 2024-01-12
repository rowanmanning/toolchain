'use strict';

const {ConfigError} = require('@rmtc/config');
const path = require('node:path');
const {Plugin} = require('@rmtc/plugin');
const {readFile, writeFile} = require('node:fs/promises');

class MitLicense extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').ConfigMethod}
	 */
	configure(config) {

		// Set some default configurations
		config = Object.assign({
			holders: null
		}, config);

		// Validate the holders
		if (config.holders && typeof config.holders !== 'string') {
			throw new ConfigError(
				`The mit-license plugin "holders" config option be a string`,
				{code: 'MIT_LICENSE_PLUGIN_CONFIG_INVALID'}
			);
		}

		return config;
	}

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('mit-license:install', this.install.bind(this));
		this.defineWorkflow('postinstall', ['mit-license:install']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async install() {
		this.log.info('syncing the license');

		const licensePath = path.join(this.project.directoryPath, 'LICENSE');

		// Grab the code of license text
		const licenseTemplate = await readFile(
			path.join(__dirname, 'templates', 'license.txt'),
			'utf-8'
		);
		const licenseDetails = [new Date().getFullYear()];
		if (this.config.holders) {
			licenseDetails.push(this.config.holders);
		}
		const idealLicense = licenseTemplate.replaceAll('{{details}}', licenseDetails.join(' '));

		// Ensure that the license exists and has the right content
		await writeFile(licensePath, idealLicense);
		this.log.info('wrote latest license');

		// Ensure that the package.json has a license property
		await this.editJsonFile('package.json', packageJson => {
			if (packageJson) {
				packageJson.license = 'MIT';
			}
			return packageJson;
		});
		this.log.info('wrote package.json license');
	}

}

exports.Plugin = MitLicense;
