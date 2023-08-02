'use strict';

const {InstallStep} = require('./base');
const {stat, writeFile} = require('node:fs/promises');

class FileInstallStep extends InstallStep {

	/** @type {string} */
	#filePath;

	/**
	 * @param {import('..').InstallManager} manager
	 * @param {string} filePath
	 */
	constructor(manager, filePath) {
		super(manager);
		this.#filePath = filePath;
		this.errorMessage = `File "${filePath}" does not exist`;
	}

	/**
	 * @returns {Promise<boolean>}
	 */
	async isApplied() {
		try {
			const fileStat = await stat(this.#filePath);
			return fileStat.isFile();
		} catch (_) {
			return false;
		}
	}

	/**
	 * @returns {Promise<void>}
	 */
	async apply() {
		await writeFile(this.#filePath, '');
	}

}

exports.FileInstallStep = FileInstallStep;
