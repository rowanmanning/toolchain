'use strict';

const {Plugin} = require('@rmtc/plugin');

class NpmScripts extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('npm-scripts:install', this.install.bind(this));
		this.defineWorkflow('postinstall', ['npm-scripts:install']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async install() {
		this.log.info('setting up package.json scripts');
		await this.editJsonFile('package.json', packageJson => {

			// Check that the package.json is an object
			if (!packageJson || typeof packageJson !== 'object' || Array.isArray(packageJson)) {
				throw new TypeError('the package.json root is not an object `{}`');
			}

			// Check that the package.json scripts is either not present or it's an object
			if (packageJson.scripts) {
				if (typeof packageJson.scripts !== 'object' || Array.isArray(packageJson.scripts)) {
					throw new TypeError('the package.json scripts property is not an object `{}`');
				}
			}

			// Set the new scripts properties
			packageJson.scripts ||= {};
			for (const workflow of this.availableWorkflows) {
				const oldScript = packageJson.scripts[workflow];
				const newScript = `toolchain ${workflow}`;
				packageJson.scripts[workflow] = newScript;
				if (newScript === oldScript) {
					this.log.debug(`nothing to do for package.json scripts.${workflow}`);
				} else {
					this.log.info(`setting package.json scripts.${workflow}`);
					this.log.info(`  - ${oldScript}`);
					this.log.info(`  + ${newScript}`);
				}
			}

			// Remove any script properties from old plugins
			for (const [workflow, script] of Object.entries(packageJson.scripts)) {
				if (
					!this.availableWorkflows.includes(workflow) &&
					typeof script === 'string' &&
					script.startsWith('toolchain ')
				) {
					this.log.info(`removing package.json scripts.${workflow}`);
					this.log.info(`  - ${packageJson.scripts[workflow]}`);
					delete packageJson.scripts[workflow];
				}
			}

			return packageJson;
		});
	}

}

exports.Plugin = NpmScripts;
