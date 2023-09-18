'use strict';

const detectIndent = require('detect-indent');
const path = require('node:path');
const {Plugin} = require('@rmtc/plugin');
const {readFile, writeFile} = require('node:fs/promises');

class NpmScripts extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('npm-scripts-install', this.install.bind(this));
		this.defineWorkflow('rmtc:install', ['npm-scripts-install']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async install() {
		this.log.info('setting up package.json scripts');

		const packagePath = path.join(this.projectDirectory, 'package.json');

		// Check that the package.json file exists
		let json;
		try {
			json = await readFile(packagePath, 'utf-8');
		} catch (cause) {
			throw new Error('package.json does not exist', {cause});
		}

		// Check that package.json is valid JSON
		let manifest;
		try {
			manifest = JSON.parse(json);
		} catch (cause) {
			throw new TypeError('package.json is not valid JSON', {cause});
		}

		// Check that the package.json is an object
		if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
			throw new TypeError('the package.json root is not an object `{}`');
		}

		// Check that the package.json scripts is either not present or it's an object
		if (manifest.scripts) {
			if (typeof manifest.scripts !== 'object' || Array.isArray(manifest.scripts)) {
				throw new TypeError('the package.json scripts property is not an object `{}`');
			}
		}

		// Exclude internal workflows (starting with rmtc:)
		const workflows = this.availableWorkflows.filter(workflow => !workflow.startsWith('rmtc:'));

		// Set the new scripts properties
		manifest.scripts ||= {};
		const manifestCopy = structuredClone(manifest);
		for (const workflow of workflows) {
			const oldScript = manifest.scripts[workflow];
			const newScript = manifestCopy.scripts[workflow] = `toolchain ${workflow}`;
			if (newScript === oldScript) {
				this.log.debug(`nothing to do for package.json scripts.${workflow}`);
			} else {
				this.log.info(`setting package.json scripts.${workflow}`);
				this.log.info(`  - ${oldScript}`);
				this.log.info(`  + ${newScript}`);
			}
		}

		// Remove any script properties from old plugins
		for (const [workflow, script] of Object.entries(manifestCopy.scripts)) {
			if (
				!workflows.includes(workflow) &&
				typeof script === 'string' &&
				script.startsWith('toolchain ')
			) {
				this.log.info(`removing package.json scripts.${workflow}`);
				this.log.info(`  - ${manifestCopy.scripts[workflow]}`);
				delete manifestCopy.scripts[workflow];
			}
		}

		// Save the file
		const {indent} = detectIndent(json);
		writeFile(packagePath, JSON.stringify(manifestCopy, null, indent));
	}

}

exports.Plugin = NpmScripts;
