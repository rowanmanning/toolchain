'use strict';

const {loadPlugins} = require('./lib/load-plugins');
const {Plugin} = require('./lib/plugin');
const {PluginSet} = require('./lib/plugin-set');

/**
 * @typedef {import('./lib/plugin').PluginConfig} PluginConfig
 */

/**
 * @typedef {import('./lib/plugin').InitMethod} InitMethod
 */

/**
 * @typedef {import('./lib/plugin').InstallMethod} InstallMethod
 */

/**
 * @typedef {import('./lib/plugin-set').StepExecutor} StepFunction
 */

/**
 * @typedef {import('./lib/plugin-set').StepParams} StepParams
 */

exports.loadPlugins = loadPlugins;
exports.Plugin = Plugin;
exports.PluginSet = PluginSet;
