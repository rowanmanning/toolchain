'use strict';

const {Config, CONFIG_FILENAME} = require('@rmtc/config');
const {Logger} = require('@rmtc/logger');
const {ToolchainError} = require('@rmtc/errors');
const path = require('node:path');
const {writeFile} = require('node:fs/promises');
const {spawn} = require('node:child_process');

/**
 * @param {object} options
 * @param {string} options.directoryPath
 * @param {import('node:process')} options.process
 * @returns {Promise<void>}
 */
exports.runCommand = async function runCommand({directoryPath, process}) {
	const logger = new Logger();
	try {

		// Create a config file if it doesn't exist
		try {
			await Config.fromFile(process.cwd());
		} catch (/** @type {any} */ error) {
			if (error.code === 'CONFIG_MISSING') {
				const configFilePath = path.join(directoryPath, CONFIG_FILENAME);
				const configTemplate = '{\n\tplugins: [],\n\tworkflows: {}\n}';
				logger.info(`creating config file at "${CONFIG_FILENAME}"`);
				await writeFile(configFilePath, configTemplate);
			}
		}

		/**
		 * @param {string} packageName
		 * @returns {Promise<void>}
		 */
		function installPackage(packageName) {
			return new Promise((resolve, reject) => {
				const child = spawn('npm', [
					'install',
					'--save-dev',
					packageName
				], {
					env: {
						...process.env,
						PWD: directoryPath
					}
				});
				child.on('close', code => {
					if (!code || code === 0) {
						return resolve();
					}
					reject(
						new ToolchainError(
							`Package install of ${packageName} failed with exit code ${code}`,
							{code: 'PACKAGE_INSTALL_FAILED'}
						)
					);
				});
			});
		}

		// Install the toolchain CLI
		logger.info('installing @rmtc/toolchain');
		await installPackage('@rmtc/toolchain');

		// Done!
		logger.info('all done');

	// Error handling
	} catch (/** @type {any} */ error) {
		process.exitCode = 1;

		// Log toolchain errors differently
		if (error instanceof ToolchainError) {
			logger.error(error);
		} else {
			logger.error(`unexpected error:\n${error.stack}`);
		}
	}
};
