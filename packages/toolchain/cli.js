#!/usr/bin/env node
'use strict';

const {parseArgs} = require('node:util');
const {runWorkflows} = require('.');

const helpText = `
This is the help.
`.trim();

let options;
try {
	options = parseArgs({
		allowPositionals: true
	});
	if (!options.positionals.length) {
		throw new Error('Workflow required');
	}
} catch (_) {
	console.log(helpText);
	process.exit(1);
}

runWorkflows({
	directoryPath: process.cwd(),
	process,
	workflows: options.positionals
}).catch(error => {
	// Final catch-all just in case
	console.error(error.stack);
	process.exit(1);
});
