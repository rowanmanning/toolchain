'use strict';

const Ajv = require('ajv/dist/2020').default;
const ajvErrors = require('ajv-errors').default;
const {ConfigError} = require('./lib/error');
const configSchema = require('./schema.json');
const JSON5 = require('json5');
const {Logger} = require('@rmtc/logger');
const path = require('node:path');
const {readFile} = require('node:fs/promises');

/**
 * @typedef {[string, import('@rmtc/plugin').PluginConfig]} ConfigDataPluginWithConfig
 */

/**
 * @typedef {string | ConfigDataPluginWithConfig} ConfigDataPlugin
 */

/**
 * @typedef {object} ConfigData
 * @property {ConfigDataPlugin[]} plugins
 * @property {Record<string, WorkflowDefinition>} workflows
 */

/**
 * @typedef {object} PluginDefinition
 * @property {string} path
 * @property {import('@rmtc/plugin').PluginConfig} config
 */

/**
 * @typedef {string[]} WorkflowDefinition
 */

const ajv = new Ajv({allErrors: true});
ajvErrors(ajv);
const validateConfigSchema = ajv.compile(configSchema);

const CONFIG_FILENAME = '.rmtc.json5';

class Config {

	/** @type {string} */
	#directoryPath;

	/** @type {string} */
	get directoryPath() {
		return this.#directoryPath;
	}

	/** @type {string} */
	#filePath;

	/** @type {string} */
	get filePath() {
		return this.#filePath;
	}

	/** @type {Logger} */
	#logger = new Logger({
		prefix: '[Config]'
	});

	/** @type {PluginDefinition[]} */
	#plugins;

	/** @type {PluginDefinition[]} */
	get plugins() {
		return this.#plugins;
	}

	/** @type {Record<string, WorkflowDefinition>} */
	#workflows;

	/** @type {Record<string, WorkflowDefinition>} */
	get workflows() {
		return this.#workflows;
	}

	/**
	 * @param {{directoryPath: string, filePath: string}} paths
	 * @param {ConfigData} configData
	 */
	constructor({directoryPath, filePath}, configData) {
		/** @type {typeof Config} */ (this.constructor).validateConfigData(configData);
		this.#directoryPath = directoryPath;
		this.#filePath = filePath;
		this.#plugins = configData.plugins.map(plugin => {
			if (typeof plugin === 'string') {
				return {
					path: plugin,
					config: {}
				};
			}
			return {
				path: plugin[0],
				config: plugin[1]
			};
		});
		this.#workflows = structuredClone(configData.workflows || {});
		this.#logger.debug(`loaded from "${filePath}"`);
	}

	/**
	 * @param {string} pluginPath
	 * @param {import('@rmtc/plugin').PluginConfig} [config]
	 * @returns {void}
	 */
	registerPlugin(pluginPath, config = {}) {
		this.#plugins.push({
			path: pluginPath,
			config
		});
	}

	/**
	 * @param {string} directoryPath
	 * @returns {Promise<Config>}
	 */
	static async fromFile(directoryPath) {
		let filePath = CONFIG_FILENAME;
		try {

			// Read and parse the config file
			filePath = path.resolve(directoryPath, CONFIG_FILENAME);
			const fileContents = await readFile(filePath, 'utf-8');
			const config = JSON5.parse(fileContents);

			// Create and return a new config object
			return new this({
				directoryPath,
				filePath
			}, config);

		} catch (/** @type {any} */ error) {

			// Config file was not found
			if (error.code === 'ENOENT') {
				throw new ConfigError({
					code: 'CONFIG_MISSING',
					message: `A config file was not found at ${filePath}`,
					cause: error
				});
			}

			// Config file was not valid JSON5
			if (error instanceof SyntaxError) {
				throw new ConfigError({
					code: 'CONFIG_INVALID_JSON5',
					message: `The config file at ${filePath} was not valid JSON5`,
					cause: error
				});
			}

			// Rethrow any other errors
			throw error;
		}
	}

	/**
	 * @param {ConfigData | any} value
	 * @returns {value is ConfigData}
	 */
	static validateConfigData(value) {
		const isValid = validateConfigSchema(value);
		if (!isValid && validateConfigSchema.errors?.length) {
			throw new ConfigError({
				code: 'CONFIG_INVALID_SCHEMA',
				message: 'The config data does not match the schema',
				validationErrors: validateConfigSchema.errors
			});
		}
		return true;
	}

}

exports.Config = Config;
exports.ConfigError = ConfigError;
