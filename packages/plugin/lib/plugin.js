'use strict';

const detectIndentation = require('detect-indentation').default;
const {isDeepStrictEqual} = require('node:util');
const path = require('node:path');
const {readFile, writeFile} = require('node:fs/promises');
const {spawn} = require('node:child_process');
const {ToolchainError} = require('@rmtc/errors');

/**
 * @typedef {Record<string, any>} PluginConfig
 */

/**
 * @callback InitMethod
 * @returns {void}
 */

/**
 * @callback ConfigMethod
 * @param {PluginConfig} config
 * @returns {PluginConfig}
 */

class Plugin {

	/** @type {PluginConfig} */
	#config;

	/** @type {PluginConfig} */
	get config() {
		return this.#config;
	}

	/** @type {string} */
	#projectDirectoryPath;

	/** @type {string} */
	get projectDirectoryPath() {
		return this.#projectDirectoryPath;
	}

	/** @type {import('@rmtc/logger').Logger} */
	#logger;

	/** @type {import('@rmtc/logger').Logger} */
	get log() {
		return this.#logger;
	}

	/** @type {import('./plugin-set').PluginSet} */
	#pluginSet;

	/** @type {string[]} */
	get availableWorkflows() {
		return this.#pluginSet.workflows;
	}

	/** @type {Plugin[]} */
	get pluginSet() {
		return this.#pluginSet.plugins;
	}

	/**
	 * @param {object} options
	 * @param {PluginConfig} options.config
	 * @param {string} options.projectDirectoryPath
	 * @param {import('@rmtc/logger').Logger} options.logger
	 * @param {import('./plugin-set').PluginSet} options.pluginSet
	 */
	constructor({config, projectDirectoryPath, logger, pluginSet}) {
		this.#projectDirectoryPath = projectDirectoryPath;
		this.#logger = logger;
		this.#pluginSet = pluginSet;
		this.#config = Object.freeze(this.configure(structuredClone(config)));
	}

	/**
	 * @param {string} name
	 * @param {string[]} [defaultSteps]
	 */
	defineWorkflow(name, defaultSteps) {
		this.log.debug(`defined workflow ${name}`);
		this.#pluginSet.defineWorkflow(name, defaultSteps);
	}

	/**
	 * @param {string} name
	 * @param {import('./plugin-set').StepExecutor} executor
	 */
	defineStep(name, executor) {
		this.log.debug(`defined step ${name}`);
		this.#pluginSet.defineStep({
			name,
			plugin: this,
			executor
		});
	}

	/**
	 * @param {string} command
	 * @param {string[]} [args]
	 * @returns {Promise<void>}
	 */
	exec(command, args = []) {
		return new Promise((resolve, reject) => {
			this.log.debug(
				`spawning child process: ${command}${args.length ? ` ${args.join(' ')}` : ''}`
			);
			const child = spawn('npx', [command, ...args], {stdio: 'inherit'});
			child.on('close', code => {
				if (!code || code === 0) {
					return resolve();
				}
				reject(new CommandError(`Command "${command}" exited with code ${code}`, {
					code: 'COMMAND_FAILED'
				}));
			});
		});
	}

	/**
	 * @param {string} filePath - The file path of the JSON file to edit.
	 * @param {(json: any) => any} transformer - A function used to transform the JSON.
	 * @returns {Promise<void>} - Resolves when the file has been written.
	 */
	async editJsonFile(filePath, transformer) {
		try {
			filePath = path.resolve(this.#projectDirectoryPath, filePath);
			const fileContents = await readFile(filePath, 'utf-8');

			let indentation = '\t';
			try {
				indentation = detectIndentation(fileContents) ?? indentation;
			} catch (error) {}

			let json = {};
			try {
				json = JSON.parse(fileContents);
			} catch (/** @type {any} */ cause) {
				throw new TypeError('package.json is not valid JSON', {cause});
			}

			const updatedJson = await transformer(structuredClone(json));
			if (!isDeepStrictEqual(json, updatedJson)) {
				await writeFile(filePath, JSON.stringify(updatedJson, null, indentation));
			}
		} catch (/** @type {any} */ cause) {
			throw new ToolchainError(`Failed to edit JSON at "${filePath}"`, {
				code: 'EDIT_JSON_FAILED',
				cause
			});
		}
	}

	/**
	 * @type {ConfigMethod}
	 */
	configure(config) {
		return config;
	}

	/**
	 * @type {InitMethod}
	 */
	init() {
		// Intentionally empty
	}

}

class CommandError extends ToolchainError {

	name = 'CommandError';

}


exports.Plugin = Plugin;
