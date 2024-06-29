'use strict';

let releasePleaseOutput;
try {
	// @ts-ignore
	releasePleaseOutput = require('../release-please-output.json');
} catch (/** @type {any} */error) {
	// biome-ignore lint/nursery/noConsole:
	console.error(`Could not load release please output: ${error.message}`);
	process.exit(1);
}

const workspaceFlags = Object.keys(releasePleaseOutput)
	.filter(key => key.endsWith('--release_created'))
	.map(key => `--workspace ${key.replace('--release_created', '')}`)
	.join(' ');

// biome-ignore lint/nursery/noConsole:
console.log(`::set-output name=workspaces::${workspaceFlags}`);
