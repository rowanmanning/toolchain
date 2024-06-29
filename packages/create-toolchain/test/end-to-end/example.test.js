'use strict';

const assert = require('node:assert');
const JSON5 = require('json5');
const path = require('node:path');
const { readFile, rm, stat, writeFile } = require('node:fs/promises');
const { spawn } = require('node:child_process');

const PROJECT_DIRECTORY = path.resolve(__dirname, 'fixtures', 'project');
const CONFIG_PATH = path.join(PROJECT_DIRECTORY, '.rmtc.json5');
const PACKAGE_PATH = path.join(PROJECT_DIRECTORY, 'package.json');
const PACKAGE_LOCK_PATH = path.join(PROJECT_DIRECTORY, 'package-lock.json');
const NODE_MODULES_PATH = path.join(PROJECT_DIRECTORY, 'node_modules');

/**
 * @returns {Promise<void>}
 */
function runCommand() {
	return new Promise((resolve, reject) => {
		const cli = path.resolve(__dirname, '..', '..', 'cli.js');
		const child = spawn('node', [cli], {
			cwd: PROJECT_DIRECTORY,
			env: {
				...process.env
			}
		});
		child.on('close', (code) => {
			if (!code || code === 0) {
				return resolve();
			}
			reject(new Error(`Command exited with code ${code}`));
		});
	});
}

/**
 * @returns {Promise<void>}
 */
async function cleanup() {
	await rm(CONFIG_PATH, { force: true });
	await rm(PACKAGE_LOCK_PATH, { force: true });
	await rm(NODE_MODULES_PATH, {
		force: true,
		recursive: true
	});
	await writeFile(PACKAGE_PATH, '{}');
}

describe('@rmtc/create-toolchain', function () {
	this.timeout(10000);
	this.slow(2000);

	before(async () => {
		await cleanup();
		await runCommand();
	});

	after(async () => {
		await cleanup();
	});

	it('creates a basic .rmtc.json5 config file', async () => {
		const configFile = JSON5.parse(await readFile(CONFIG_PATH, 'utf-8'));
		assert.deepEqual(configFile.plugins, []);
		assert.deepEqual(configFile.workflows, {});
	});

	it('installs @rmtc/toolchain as a development dependency', async () => {
		const packageFile = JSON.parse(await readFile(PACKAGE_PATH, 'utf-8'));
		assert.deepEqual(Object.keys(packageFile.devDependencies), ['@rmtc/toolchain']);
		assert.ok((await stat(PACKAGE_LOCK_PATH)).isFile());
		assert.ok((await stat(NODE_MODULES_PATH)).isDirectory());
		assert.ok((await stat(path.join(NODE_MODULES_PATH, '@rmtc', 'toolchain'))).isDirectory());
	});
});
