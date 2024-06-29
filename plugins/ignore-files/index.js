'use strict';

const path = require('node:path');
const { Plugin } = require('@rmtc/plugin');
const { readFile, writeFile } = require('node:fs/promises');

class IgnoreFiles extends Plugin {
	/**
	 * @type {import('@rmtc/plugin').InitMethod}
	 */
	init() {
		this.defineStep('ignore-files:install', this.install.bind(this));
		this.defineWorkflow('postinstall', ['ignore-files:install']);
	}

	/**
	 * @type {import('@rmtc/plugin').StepFunction}
	 */
	async install() {
		// Write the root level .gitignore file
		this.#ensureIgnoreFileHasStatements('.gitignore', [
			'.nyc_output',
			'*.d.ts.map',
			'*.d.ts',
			'coverage',
			'node_modules',
			'npm-debug.log'
		]);

		// Write the root level .npmignore file if required
		// (either a public root package or a monorepo)
		if (!this.project.isPrivate || this.project.isMonorepo) {
			this.#ensureIgnoreFileHasStatements('.npmignore', [
				'!*.d.ts.map',
				'!*.d.ts',
				'.commitlintrc.json',
				'.eslintrc.json',
				'.github',
				'.husky',
				'.nyc_output',
				'.release-please-manifest.json',
				'biome.json',
				'CHANGELOG.md',
				'coverage',
				'docs',
				'example',
				'jsconfig.json',
				'release-please-config.json',
				'test'
			]);
		}
	}

	/**
	 * @param {string} fileName
	 * @param {string[]} statements
	 * @returns {Promise<void>}
	 */
	async #ensureIgnoreFileHasStatements(fileName, statements) {
		this.log.info(`writing ${fileName}`);
		const ignorePath = path.join(this.project.directoryPath, fileName);
		const ignoreStatements = await this.#readIgnoreFile(ignorePath);
		for (const statement of statements) {
			ignoreStatements.add(statement);
		}
		await this.#writeIgnoreFile(ignorePath, ignoreStatements);
	}

	/**
	 * @param {string} filePath
	 * @returns {Promise<Set<string>>}
	 */
	async #readIgnoreFile(filePath) {
		try {
			const contents = await readFile(filePath, 'utf-8');
			return new Set(contents.split(/[\r\n]+/).filter(Boolean));
		} catch (/** @type {any} */ error) {
			if (error.code === 'ENOENT') {
				return new Set();
			}
			throw error;
		}
	}

	/**
	 * @param {string} filePath
	 * @param {Set<string>} statements
	 * @returns {Promise<void>}
	 */
	async #writeIgnoreFile(filePath, statements) {
		const sortedStatements = [...statements].sort();
		sortedStatements.push('');
		await writeFile(filePath, sortedStatements.join('\n'));
	}
}

exports.Plugin = IgnoreFiles;
