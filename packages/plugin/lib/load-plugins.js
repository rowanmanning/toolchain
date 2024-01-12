'use strict';

const {Logger} = require('@rmtc/logger');
const {Plugin} = require('./plugin');
const {PluginSet} = require('./plugin-set');
const {ToolchainError} = require('@rmtc/errors');

/**
 * @typedef {object} LoadedPluginDefinition
 * @property {typeof Plugin} constructor
 * @property {import('@rmtc/plugin').PluginConfig} config
 */

/**
 * @param {import('@rmtc/config').Config} config
 * @param {import('@rmtc/project').Project} project
 * @returns {PluginSet}
 */
function loadPlugins(config, project) {
	const pluginSet = new PluginSet();
	for (const plugin of config.plugins) {
		pluginSet.addPlugin(loadPlugin(plugin, pluginSet, project));
	}
	return pluginSet;
}

/**
 * @param {import('@rmtc/config').PluginDefinition} definition
 * @param {PluginSet} pluginSet
 * @param {import('@rmtc/project').Project} project
 * @returns {Plugin}
 */
function loadPlugin({path: pluginPath, config}, pluginSet, project) {
	try {
		const resolvedPluginPath = require.resolve(pluginPath, {
			paths: [project.directoryPath]
		});

		/** @type {{Plugin: typeof Plugin}} */
		const pluginModule = require(resolvedPluginPath);

		// Check that the plugin is valid
		if (!(pluginModule?.Plugin?.prototype instanceof Plugin)) {
			throw new ToolchainError(
				`The plugin file at "${pluginPath}" does not export a \`Plugin\` property that extends @rmtc/plugin`,
				{code: 'PLUGIN_INVALID'}
			);
		}

		return new pluginModule.Plugin({
			config,
			logger: new Logger({
				prefix: `[${pluginModule.Plugin.name}]`
			}),
			pluginSet,
			project
		});

	} catch (/** @type {any} */ error) {

		// Config file was not found
		if (error.code === 'MODULE_NOT_FOUND') {
			throw new ToolchainError(
				`A plugin file was not found at "${pluginPath}"`,
				{
					code: 'PLUGIN_MISSING',
					cause: error
				}
			);
		}

		// Config file was not valid JavaScript
		if (error instanceof SyntaxError) {
			throw new ToolchainError(
				`The plugin file at "${pluginPath}" was not valid JavaScript`,
				{
					code: 'PLUGIN_INVALID_JAVASCRIPT',
					cause: error
				}
			);
		}

		// Rethrow any other errors
		throw error;
	}
}

exports.loadPlugins = loadPlugins;
