'use strict';

const {loadPlugins} = require('./lib/load-plugins');
const {Plugin} = require('./lib/plugin');
const {PluginSet} = require('./lib/plugin-set');

/**
 * @typedef {import('./lib/plugin').PluginConfig} PluginConfig
 */

/**
 * @typedef {import('./lib/plugin-set').StepParams} StepParams
 */

exports.loadPlugins = loadPlugins;
exports.Plugin = Plugin;
exports.PluginSet = PluginSet;
