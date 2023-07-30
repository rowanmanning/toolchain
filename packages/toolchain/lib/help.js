'use strict';

/**
 * @param {import('../').CLIOptions} options
 * @returns {string}
 */
exports.help = function help(options) {
	return `
		usage: toolchain [options] <workflow>

		options:
		${describeOptions(options).join('\n')}
	`.replaceAll('\t', '').trim();
};

/**
 * @param {import('../').CLIOptions} options
 * @returns {string[]}
 */
function describeOptions(options) {
	return Object.entries(options).map(([key, option]) => {
		let output = `  --${key}`;
		if (option.short) {
			output += `|-${option.short}`;
		}
		if (option.helpText) {
			output += `: ${option.helpText}`;
		}
		return output;
	});
}
