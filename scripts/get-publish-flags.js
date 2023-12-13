'use strict';

let releasePleaseOutput;
try {
	// @ts-ignore
	releasePleaseOutput = require('../release-please-output.json');
} catch (/** @type {any} */error) {
	console.error(`Could not load release please output: ${error.message}`);
	process.exit(1);
}

const workspaceFlags = Object.keys(releasePleaseOutput)
	.filter(key => key.endsWith('--release_created'))
	.map(key => `--workspace ${key.replace('--release_created', '')}`)
	.join(' ');

console.log(`::set-output name=workspaces::${workspaceFlags}`);
