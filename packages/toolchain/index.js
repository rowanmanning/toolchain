'use strict';

const {Config} = require('@rmtc/config');
const {help} = require('./lib/help');
const {Logger} = require('@rmtc/logger');
const {Runner} = require('./lib/runner');
const {ToolchainError} = require('@rmtc/errors');
const {parseArgs} = require('node:util');

/**
 * @typedef {object} CLIOption
 * @property {"string" | "boolean"} type
 * @property {string} [short]
 * @property {boolean} [multiple]
 * @property {string} [helpText]
 */

/**
 * @typedef {Record<string, CLIOption>} CLIOptions
 */

/** @type {CLIOptions} */
const cliOptions = {
	help: {
		type: 'boolean',
		short: 'h',
		helpText: 'show command help'
	},
	ci: {
		type: 'boolean',
		short: 'c',
		helpText: 'run workflows in continuous integration mode'
	},
	list: {
		type: 'boolean',
		short: 'l',
		helpText: 'output all available workflows and steps'
	}
};

/**
 * @param {object} options
 * @param {string} options.directoryPath
 * @param {import('node:process')} options.process
 * @returns {Promise<void>}
 */
exports.runCommand = async function runCommand({directoryPath, process}) {
	const logger = new Logger();
	try {

		/** @type {import('node:util').ParseArgsConfig} */
		const cliConfig = {
			args: process.argv.slice(2),
			allowPositionals: true,
			options: Object.fromEntries(Object.entries(cliOptions).map(([key, value]) => {
				return [key, {
					type: value.type,
					short: value.short,
					multiple: value.multiple || false
				}];
			}))
		};
		const cli = parseArgs(cliConfig);

		// Show help text
		if (
			(
				cli.values.help ||
				!cli.positionals.length ||
				cli.positionals.includes('help')
			) && !cli.values.list
		) {
			logger.info(help(cliOptions));
			return;
		}

		// Default the environment
		const environment = cli.values.ci || process.env.CI ? 'ci' : 'local';

		// Load the config file
		const config = await Config.fromFile(directoryPath);

		// Set up a runner
		const runner = new Runner({
			config,
			logger
		});

		// List all workflows and steps
		if (cli.values.list) {
			const workflows = runner.workflows.map(workflow => `  - ${workflow}`).join('\n');
			const steps = runner.steps.map(step => `  - ${step}`).join('\n');
			logger.info(`workflows:\n${workflows}`);
			logger.info(`steps:\n${steps}`);
			return;
		}

		// Re-validate the config
		runner.revalidateConfig();

		// Run each workflow
		for (const workflow of cli.positionals) {
			await runner.executeWorkflow(workflow, {
				environment
			});
		}

	// Error handling
	} catch (/** @type {any} */ error) {
		process.exitCode = 1;

		if (error.code?.startsWith('ERR_PARSE_ARGS_')) {
			logger.error(error);
			logger.info(`\n${help(cliOptions)}`);
			return;
		}

		// Log toolchain errors differently
		if (error instanceof ToolchainError) {
			logger.error(error);
		} else {
			logger.error(`unexpected error:\n${error.stack}`);
		}
	}
};

