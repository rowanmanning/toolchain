'use strict';

const {Config} = require('@rmtc/config');
const {Logger} = require('@rmtc/logger');
const {Runner} = require('./lib/runner');
const {ToolchainError} = require('@rmtc/errors');

/**
 * @param {object} options
 * @param {string} options.directoryPath
 * @param {import('node:process')} options.process
 * @param {string[]} options.workflows
 * @returns {Promise<void>}
 */
exports.runWorkflows = async function runWorkflows({directoryPath, process, workflows}) {
	const logger = new Logger({
		prefix: '[Runner]'
	});
	try {
		// Load the config file
		const config = await Config.fromFile(directoryPath);

		// Set up a runner
		const runner = new Runner({
			config,
			logger
		});

		// Run each workflow
		for (const workflow of workflows) {
			await runner.executeWorkflow(workflow, {
				environment: 'local' // TODO don't hard-code
			});
		}
	} catch (/** @type {any} */ error) {
		if (error instanceof ToolchainError) {
			logger.error(error);
		} else {
			logger.error(`unexpected error:\n${error.stack}`);
		}
		process.exitCode = 1;
	}
};
