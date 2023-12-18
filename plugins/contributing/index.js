'use strict';

const {ConfigError} = require('@rmtc/config');
const path = require('node:path');
const {Plugin} = require('@rmtc/plugin');
const {readFile, mkdir, writeFile} = require('node:fs/promises');

const VALID_TECH_SECTIONS = [
	'conventional-commits',
	'linting',
	'testing',
	'types-in-jsdoc'
];

class Contributing extends Plugin {

	/**
	 * @type {import('@rmtc/plugin').ConfigMethod}
	 */
	configure(config) {

		// Set some default configurations
		config = Object.assign({
			techSections: []
		}, config);

		// Validate the techSections
		if (
			!Array.isArray(config.techSections) ||
			!config.techSections.every(section => VALID_TECH_SECTIONS.includes(section))
		) {
			throw new ConfigError(
				// eslint-disable-next-line max-len
				`The contributing plugin "techSections" config option be an array with only the following values: ${VALID_TECH_SECTIONS.join(', ')}`,
				{code: 'CONTRIBUTING_PLUGIN_CONFIG_INVALID'}
			);
		}

		return config;
	}

	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('contributing:install', this.install.bind(this));
		this.defineWorkflow('postinstall', ['contributing:install']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async install() {
		this.log.info('syncing the contributing guides');

		const docsPath = path.join(this.projectDirectoryPath, 'docs');
		const codeOfConductPath = path.join(docsPath, 'code_of_conduct.md');
		const contributingGuidePath = path.join(docsPath, 'contributing.md');

		// Grab the code of conduct markdown
		const idealCodeOfConduct = await readFile(
			path.join(__dirname, 'templates', 'code-of-conduct', 'main.md'),
			'utf-8'
		);

		// Compile together the contributing guide markdown
		const contributingTemplates = path.join(__dirname, 'templates', 'contributing');
		const contributingGuide = await Promise.all([
			readFile(path.join(contributingTemplates, 'main.md'), 'utf-8'),
			...this.config.techSections.map(
				section => readFile(
					path.join(contributingTemplates, 'sections', 'tech', `${section}.md`), 'utf-8'
				)
			)
		]);

		// Ensure that the docs directory exists
		await mkdir(docsPath, {recursive: true});

		// Ensure that the code of conduct exists and has the right content
		await writeFile(codeOfConductPath, idealCodeOfConduct);
		this.log.info('wrote latest code of conduct');

		// Ensure that the contributing guide exists and has the right content
		await writeFile(contributingGuidePath, contributingGuide.join('\n'));
		this.log.info('wrote latest contributing guide');
	}

}

exports.Plugin = Contributing;
